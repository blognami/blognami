
import { join, dirname } from 'node:path';
import { readFile, readdir } from 'node:fs/promises';
import { inflector } from 'haberdash';

import { Project, Playbook } from '../index.js';

export default {
    meta(){
        this.assignProps({
            description: 'Generates a new playbook directory in the project .cardoon/lib/playbooks directory. If a playbook with this name already exists, its directory contents are copied locally so they can be customised, and hands off to an agent to write it.',
            sandboxed: true
        });
        this.tag('playbook');

        this.hasParam('name', { type: 'string', alias: 'arg1', description: 'The name of the playbook to create.' });
        this.hasParam('skipAgentHandoff', {
            type: 'boolean',
            alias: 'S',
            optional: true,
            description: 'Scaffold the placeholder file and exit; skip the interactive agent handoff.'
        });
    },

    async run(){
        const libRoot = this.libDir ?? join(Project.instance.cardoonPath, 'lib');
        const dashed = inflector.dasherize(this.params.name);
        const { generateDir, generateFile } = this.fsBuilder;

        let sourceDir = null;
        const existingFilePath = Playbook.for(dashed).latestFilePath;
        if (existingFilePath) sourceDir = dirname(existingFilePath);

        const useExistingFile = !!existingFilePath;
        const authoringDocAbsPath = join(dirname(Playbook.for('cardoon').latestFilePath), 'authoring-playbooks.md');

        await generateDir(join(libRoot, 'playbooks'), async () => {
            await generateFile('_file_importer.js', { skipIfExists: true }, ({ line }) => {
                line("export { Playbook as default } from 'cardoon';");
            });

            await generateDir(dashed, async () => {
                if (sourceDir) {
                    const entries = await readdir(sourceDir, { withFileTypes: true });
                    const mdFiles = entries.filter(e => e.isFile() && e.name.endsWith('.md'));
                    for (const entry of mdFiles) {
                        const data = (await readFile(join(sourceDir, entry.name))).toString('utf8');
                        await generateFile(entry.name, ({ echo }) => echo(data));
                    }
                } else {
                    await generateFile('index.md', ({ echo }) => {
                        echo(`TODO: write the '${dashed}' playbook. This file is the entry point an agent reads first — put the playbook's instructions here, and split detail into sibling .md files for progressive reveal.\n`);
                    });
                }
            });
        });

        if(!this.params.skipAgentHandoff){
            const generatedAbsPath = join(libRoot, 'playbooks', dashed);

            const { exitCode } = await this.agent.run({
                interactive: true,
                systemPrompt({ playbooks, line }){
                    line('You are an agent in a Cardoon session.');
                    playbooks();
                    line();
                    line('## Your task this session');
                    line();
                    if(useExistingFile){
                        line(`You have overridden the built-in playbook \`${dashed}\` by copying its directory to \`${generatedAbsPath}\`. Your task this session is to help the user customise it.`);
                    } else {
                        line(`You have just scaffolded the placeholder playbook \`${dashed}\` at \`${generatedAbsPath}\`. Your task this session is to write it.`);
                    }
                    line();
                    line(`Read \`${authoringDocAbsPath}\` for the full authoring contract for playbooks, then edit \`${generatedAbsPath}/index.md\` (and any siblings) accordingly.`);
                },
                prompt: 'Begin the session.'
            });
            process.exit(exitCode);
        }
    }
};
