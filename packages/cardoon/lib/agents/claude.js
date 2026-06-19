// options.systemPrompt maps to --system-prompt, so the value REPLACES Claude Code's built-in system prompt.

import { spawn } from 'child_process';
import { Class } from 'haberdash';

// The claude CLI strips its own auth env vars from Bash-tool subprocesses, which
// breaks nested cardoon → claude calls. Relay the parent env through one var the
// strip ignores, then merge it back in the child — current env wins, so PATH,
// HOME, etc. stay correct.
export const RELAY_KEY = 'CARDOON_PARENT_ENV';

export function relayEnv(env){
    const out = { ...JSON.parse(env[RELAY_KEY] || '{}'), ...env };
    delete out[RELAY_KEY];
    out[RELAY_KEY] = JSON.stringify(out);
    return out;
}

export default {
    meta(){
        this.annotate({
            description: 'Claude CLI agent provider.'
        });
    },

    async run(options = {}){
        const { onLog, spawner = spawn, cwd, env, model = 'opus', effort = 'xhigh', systemPrompt, prompt, interactive } = options;

        const promptText = prompt ?? '';
        const systemText = systemPrompt;

        // DISABLE_AUTOUPDATER silences the claude CLI's auto-update check — noise for programmatic runs.
        // The bash timeout caps default to 2/10 minutes — too short for the blocking foreground
        // worker-spawn calls the playbooks mandate (a headless session dies the moment the model
        // ends its turn, so waiting on a background task is not an option).
        const spawnOpts = { cwd, env: relayEnv({
            ...process.env,
            DISABLE_AUTOUPDATER: '1',
            BASH_DEFAULT_TIMEOUT_MS: '600000',
            BASH_MAX_TIMEOUT_MS: '14400000',
            ...env,
        }) };

        if (interactive) {
            const args = ['--permission-mode', 'bypassPermissions'];
            if (model) args.push('--model', model);
            if (effort) args.push('--effort', effort);
            if (systemText) args.push('--system-prompt', systemText);
            if (promptText) args.push(promptText);

            spawnOpts.stdio = 'inherit';
            return new Promise((resolve, reject) => {
                const proc = spawner('claude', args, spawnOpts);
                proc.on('close', exitCode => resolve({ exitCode }));
                proc.on('error', reject);
            });
        }

        const args = [
            '--permission-mode', 'bypassPermissions',
            '--print', '--verbose',
            '--output-format', 'stream-json',
        ];
        if (model) args.push('--model', model);
        if (effort) args.push('--effort', effort);
        if (systemText) args.push('--system-prompt', systemText);
        args.push('-p', promptText);

        spawnOpts.stdio = ['ignore', 'pipe', 'pipe'];
        const processor = new StreamProcessor(onLog);

        return new Promise((resolve, reject) => {
            const proc = spawner('claude', args, spawnOpts);
            let remainder = '';

            proc.stdout.on('data', data => {
                const parts = (remainder + data.toString()).split('\n');
                remainder = parts.pop();
                for (const line of parts) {
                    if (line.trim()) processor.processLine(line);
                }
            });

            proc.stderr.on('data', data => {
                if (typeof onLog === 'function') {
                    const lines = data.toString().split('\n');
                    for (const line of lines) {
                        if (line) onLog(line);
                    }
                }
            });

            proc.on('close', exitCode => {
                if (remainder.trim()) processor.processLine(remainder);
                resolve({ exitCode, text: processor.text });
            });

            proc.on('error', reject);
        });
    }
};

export const StreamProcessor = Class.extend('StreamProcessor').include({
    initialize(onLog){
        this.onLog = typeof onLog === 'function' ? onLog : null;
        this.textParts = [];
        this.lastEmitType = null;
    },

    emit(type, line){
        if (!this.onLog) return;
        if (this.lastEmitType !== null && !(this.lastEmitType === 'tool' && type === 'tool')) {
            this.onLog('');
        }
        this.onLog(line);
        this.lastEmitType = type;
    },

    processLine(line){
        let msg;
        try { msg = JSON.parse(line); } catch { return; }
        if (msg.type !== 'assistant' || !msg.message?.content) return;

        for (const block of msg.message.content) {
            if (block.type === 'text') {
                if (!block.text || !block.text.trim()) continue;
                this.textParts.push(block.text);
                this.emit('text', block.text);
            } else if (block.type === 'tool_use') {
                const short = this.formatToolInput(block.input);
                const suffix = short ? ` ${short}` : '';
                if (this.lastEmitType !== 'tool') {
                    this.emit('tool', 'Tool call(s):');
                }
                this.emit('tool', `- ${block.name}${suffix}`);
            }
        }
    },

    formatToolInput(input){
        if (!input) return '';
        if (input.file_path) return input.file_path;
        if (input.pattern) return input.pattern;
        if (input.command) {
            return input.command.length > 60 ? input.command.slice(0, 60) + '...' : input.command;
        }
        return '';
    },

    get text(){
        return this.textParts.join('\n\n');
    }
});
