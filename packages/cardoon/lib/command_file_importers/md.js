import { basename, join, relative } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import Yaml from 'js-yaml';
import { inflector } from 'haberdash';
import { Command, PromptText } from 'cardoon';

export function renderParamsBlock(paramEntries, values){
    const escape = s => String(s).replace(/\|/g, '\\|');
    const rows = [];
    for(const [name, spec] of paramEntries){
        const value = values[name];
        if(value === undefined) continue;
        const description = escape(spec.description ?? '');
        const json = escape(JSON.stringify(value).replace(/`/g, '&#96;'));
        rows.push(`| ${name} | ${description} | \`${json}\` |`);
    }
    if(rows.length === 0) return '';
    return [
        '',
        '',
        '## Params',
        '',
        'Values below are JSON-encoded — strings appear quoted, numbers/booleans/null appear bare.',
        '',
        '| Param | Description | Value (JSON) |',
        '|-------|-------------|--------------|',
        ...rows,
        ''
    ].join('\n');
}

function reconstructCommandLine(commandName, paramNames, params){
    const tokens = [commandName];
    for(const name of paramNames){
        const value = params[name];
        if(value === undefined || value === false) continue;
        const dashed = inflector.dasherize(name);
        if(value === true){
            tokens.push(`--${dashed}`);
        } else {
            tokens.push(`--${dashed}=${JSON.stringify(value)}`);
        }
    }
    return tokens.join(' ');
}

Command.FileImporter.register('md', {
    async importFile(){
        if(!this.isExactMatch) return;

        const { filePath, relativeFilePathWithoutExtension } = this;
        const data = await readFile(filePath, 'utf8');
        const [ frontMatter, body ] = extractFrontMatterAndBody(data);

        const paramEntries = Object.entries(frontMatter.params ?? {});
        const paramNames = paramEntries.map(([name]) => name);

        if(paramNames.includes('follow')){
            throw new Error(`Markdown command at ${filePath} declares reserved param 'follow'.`);
        }

        Command.register(relativeFilePathWithoutExtension, {
            meta(){
                this.filePaths.push(filePath);
                this.assignProps({ ...frontMatter, sandboxed: true });

                for(const [name, spec] of paramEntries){
                    this.hasParam(name, spec);
                }

                this.hasParam('follow', {
                    type: 'boolean',
                    alias: 'f',
                    optional: true,
                    description: 'Stream log output to stdout as well as the log file.'
                });
            },

            async run(){
                const logger = await this.logger;
                const project = await this.project;
                const rel = p => relative(project.rootPath, p);

                const sessionDir = logger.sessionDir;
                const sessionId = basename(sessionDir);
                const indexMdPath = rel(join(sessionDir, 'index.md'));
                const systemPromptPath = rel(join(sessionDir, 'system-prompt.md'));
                const promptPath = rel(join(sessionDir, 'prompt.md'));
                const startedAt = new Date().toISOString();

                const values = Object.fromEntries(paramEntries.map(([name, spec]) => {
                    const value = this.params[name];
                    return [name, value !== undefined ? value : spec.default];
                }));

                const systemPrompt = (await PromptText.render(({ playbooks, echo, line }) => {
                    playbooks();
                    line();
                    echo(body);
                    if(paramNames.length > 0){
                        echo(renderParamsBlock(paramEntries, values));
                    }
                })).toString();

                const userPrompt = 'Begin the session.';

                await writeFile(join(sessionDir, 'system-prompt.md'), systemPrompt);
                await writeFile(join(sessionDir, 'prompt.md'), userPrompt);

                const reconstructedCmd = reconstructCommandLine(
                    this.constructor.name, [...paramNames, 'follow'], this.params
                );

                const header = `# Session ${sessionId}\n\nHere are details of the current session:\n- Command: ${reconstructedCmd}\n- Log: ${indexMdPath}\n- System prompt: ${systemPromptPath}\n- Prompt: ${promptPath}\n- Started: ${startedAt}\n\n## Command output\n\n`;

                await writeFile(join(sessionDir, 'index.md'), header);

                const highlightedPath = process.stdout.isTTY
                    ? `\x1b[1;36m${indexMdPath}\x1b[0m`
                    : indexMdPath;
                process.stdout.write(`Log: tail -f ${highlightedPath}\n\n`);

                const follow = Boolean(this.params.follow);
                const onLog = line => {
                    if(follow) process.stdout.write(line + '\n');
                    return logger.log(line);
                };

                const { exitCode } = await this.agent.run({
                    systemPrompt,
                    prompt: userPrompt,
                    onLog,
                    env: { CARDOON_PARENT_SESSION_DIR: sessionDir }
                });
                process.exit(exitCode ?? 0);
            }
        });
    }
});

function extractFrontMatterAndBody(data){
    let frontMatter = {};
    let body = '';
    const matches = data.match(/^---+[\r\n]([\S\s]*?)[\r\n]---+([\S\s]*)$/);
    if(matches){
        frontMatter = Yaml.load(matches[1]);
        body = matches[2].replace(/^\n/, '');
    } else {
        body = data;
    }
    return [ frontMatter, body ];
}
