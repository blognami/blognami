
import { join, dirname } from 'node:path';
import { readFile } from 'node:fs/promises';
import { inflector, ValidationError } from 'haberdash';

import { Project, Playbook, Command } from '../index.js';

function parseNameAndExtension(raw) {
    const match = raw.match(/^(.+)\.([^.]+)$/);
    if (match) {
        const [, base, ext] = match;
        if (ext === 'md' || ext === 'js') return { name: base, extension: ext, explicit: true };
        throw new ValidationError({ name: `Unsupported extension in '${raw}'. Use .md or .js (or omit the extension for .md).` });
    }
    return { name: raw, extension: 'md', explicit: false };
}

export default {
    meta(){
        this.assignProps({
            description: 'Scaffolds a new command file (markdown by default; pass an explicit `.js` extension for a JS command) in the project `.sartor/lib/commands/` directory and hands off to an agent to implement it. If a command with this name already exists, its source is copied locally so it can be customised.',
            sandboxed: true
        });

        this.hasParam('name', { type: 'string', alias: 'arg1', description: 'The name of the command to create.' });
        this.hasParam('skipAgentHandoff', {
            type: 'boolean',
            alias: 'S',
            optional: true,
            description: 'Scaffold the placeholder file and exit; skip the interactive agent handoff.'
        });
    },

    async run(){
        const libRoot = this.libDir ?? join(Project.instance.sartorPath, 'lib');
        const { name, extension: parsedExtension, explicit } = parseNameAndExtension(this.params.name);
        const snake = inflector.snakeify(name);
        const dashed = inflector.dasherize(name);
        const { generateDir, generateFile } = this.fsBuilder;

        let existingFilePath = null, existingFileExtension = null, existingFileData = null;
        existingFilePath = Command.for(dashed).latestFilePath;
        if (existingFilePath) {
            existingFileExtension = existingFilePath.match(/\.([^./]+)$/)?.[1] ?? null;
        }

        const extension = explicit ? parsedExtension : (existingFileExtension ?? 'md');
        const useExistingFile = !!existingFilePath && extension === existingFileExtension;

        if (useExistingFile) {
            existingFileData = (await readFile(existingFilePath)).toString('utf8');
        }

        const authoringDocAbsPath = join(dirname(Playbook.for('sartor').latestFilePath), `authoring-${extension}-commands.md`);

        await generateDir(join(libRoot, 'commands'), async () => {
            await generateFile('_file_importer.js', { skipIfExists: true }, ({ line }) => {
                line("export { Command as default } from 'sartor';");
            });

            if (useExistingFile) {
                await generateFile(`${snake}.${extension}`, ({ echo }) => echo(existingFileData));
            } else if (extension === 'js') {
                await generateFile(`${snake}.js`, ({ line, indent }) => {
                    line();
                    line('export default {');
                    indent(({ line, indent }) => {
                        line('meta(){');
                        indent(({ line }) => {
                            line(`this.assignProps({ description: '${dashed} command coming soon!' });`);
                        });
                        line('},');
                        line();
                        line('run(){');
                        indent(({ line }) => {
                            line(`console.log('${dashed} command coming soon!');`);
                        });
                        line('}');
                    });
                    line('};');
                });
            } else {
                await generateFile(`${snake}.md`, ({ line }) => {
                    line('---');
                    line(`description: ${dashed} command coming soon!`);
                    line('---');
                    line();
                    line(`TODO: replace this body with the agent's system prompt for the \`${dashed}\` command.`);
                    line();
                    line(`Read \`${authoringDocAbsPath}\` for the full authoring contract (frontmatter, params, body conventions, sandbox routing, logging).`);
                });
            }
        });

        if(!this.params.skipAgentHandoff){
            const generatedAbsPath = join(libRoot, 'commands', `${snake}.${extension}`);

            const { exitCode } = await this.agent.run({
                interactive: true,
                systemPrompt({ playbooks, line }){
                    line('You are an agent in a Sartor session.');
                    playbooks();
                    line();
                    line('## Your task this session');
                    line();
                    if(useExistingFile){
                        line(`You have overridden the built-in command \`${dashed}\` by copying it to \`${generatedAbsPath}\`. Your task this session is to help the user customise it.`);
                        line();
                        line(`Read \`${authoringDocAbsPath}\` for the full authoring contract for ${extension} commands, then edit the generated file accordingly.`);
                    } else {
                        line(`You have just scaffolded the placeholder command \`${dashed}\` at \`${generatedAbsPath}\`. Your task this session is to implement it.`);
                        line();
                        line('Before editing the file:');
                        line();
                        line(`1. Refer to the sartor playbook for the ${extension} command authoring contract.`);
                        line('2. Ask the user what they want the command to do, and confirm any assumptions about its scope, params, and behaviour.');
                        line();
                        line('Only then edit the generated file to implement the command.');
                    }
                },
                prompt: 'Begin the session.'
            });
            process.exit(exitCode);
        }
    }
};
