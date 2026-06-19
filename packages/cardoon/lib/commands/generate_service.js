
import { join, dirname } from 'node:path';
import { readFile } from 'node:fs/promises';
import { inflector } from 'haberdash';

import { Project, Playbook, ServiceFactory } from '../index.js';

export default {
    meta(){
        this.assignProps({
            description: 'Generates a new service file in the project .cardoon/lib/services directory. If a service with this name already exists, its source is copied locally so it can be customised, and hands off to an agent to implement it.',
            sandboxed: true
        });
        this.tag('core');

        this.hasParam('name', { type: 'string', alias: 'arg1', description: 'The name of the service to create.' });
        this.hasParam('skipAgentHandoff', {
            type: 'boolean',
            alias: 'S',
            optional: true,
            description: 'Scaffold the placeholder file and exit; skip the interactive agent handoff.'
        });
    },

    async run(){
        const libRoot = this.libDir ?? join(Project.instance.cardoonPath, 'lib');
        const snake = inflector.snakeify(this.params.name);
        const camel = inflector.pascalize(this.params.name);
        const dashed = inflector.dasherize(this.params.name);
        const { generateDir, generateFile } = this.fsBuilder;

        let existingFilePath = null, existingFileData = null;
        existingFilePath = ServiceFactory.for(dashed).latestFilePath;
        if (existingFilePath) {
            existingFileData = (await readFile(existingFilePath)).toString('utf8');
        }

        const useExistingFile = !!existingFilePath;
        const authoringDocAbsPath = join(dirname(Playbook.for('cardoon').latestFilePath), 'authoring-services.md');

        await generateDir(join(libRoot, 'services'), async () => {
            await generateFile('_file_importer.js', { skipIfExists: true }, ({ line }) => {
                line("export { ServiceFactory as default } from 'cardoon';");
            });

            if (existingFilePath) {
                await generateFile(`${snake}.js`, ({ echo }) => echo(existingFileData));
            } else {
                await generateFile(`${snake}.js`, ({ line, indent }) => {
                    line();
                    line('export default {');
                    indent(({ line, indent }) => {
                        line('create(){');
                        indent(({ line }) => {
                            line(`return 'Example ${camel} service';`);
                        });
                        line('}');
                    });
                    line('};');
                });
            }
        });

        if(!this.params.skipAgentHandoff){
            const generatedAbsPath = join(libRoot, 'services', `${snake}.js`);

            const { exitCode } = await this.agent.run({
                interactive: true,
                systemPrompt({ playbooks, line }){
                    line('You are an agent in a Cardoon session.');
                    playbooks();
                    line();
                    line('## Your task this session');
                    line();
                    if(useExistingFile){
                        line(`You have overridden the built-in service \`${dashed}\` by copying it to \`${generatedAbsPath}\`. Your task this session is to help the user customise it.`);
                    } else {
                        line(`You have just scaffolded the placeholder service \`${dashed}\` at \`${generatedAbsPath}\`. Your task this session is to implement it.`);
                    }
                    line();
                    line(`Read \`${authoringDocAbsPath}\` for the full authoring contract for services, then edit the generated file accordingly.`);
                },
                prompt: 'Begin the session.'
            });
            process.exit(exitCode);
        }
    }
};
