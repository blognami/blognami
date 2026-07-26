
export default {
    meta(){
        this.addHook('run', 'generateReadme');
    },

    async run(){
        await this.runHook('run');
    },

    async generateReadme(){
        const { inProjectRootDir, generateFile } = this.fsBuilder;

        await inProjectRootDir(async () => {
            await generateFile(`README.md`, { skipIfExists: true }, async (dsl) => {
                const { line } = dsl;

                line();
                line(`# ${await this.project.name}`);
                line();
                line('## Getting started');
                line();
                line('```bash');
                line('npx pinstripe initialize-database');
                line('npx pinstripe start-server');
                line('```');
                await this.runHook('generateReadmeNotes', {
                    args: [dsl],
                    beforeEach({ line }){
                        line();
                    }
                });
                line();
            });
        });
    }
};
