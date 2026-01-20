

export default {
    meta(){
        this.annotate({
            description: 'Generates a new job file in the lib/jobs directory.'
        });

        this.hasParam('name', { type: 'string', alias: 'arg1', description: 'The name of the job to create (in snake_case).' });
    },

    async run(){
        const normalizedName = this.inflector.snakeify(this.params.name);

        const { inProjectRootDir, generateFile } = this.fsBuilder;

        await inProjectRootDir(async () => {

            await generateFile(`lib/jobs/_file_importer.js`, { skipIfExists: true }, ({ line }) => {
                line();
                line(`export { Job as default } from 'pinstripe';`);
                line();
            });

            await generateFile(`lib/jobs/${normalizedName}.js`, ({ line, indent }) => {
                line();
                line(`export default {`);
                indent(({ line, indent }) => {
                    line('meta(){');
                    indent(({ line }) => {
                        line(`this.schedule('* * * * *'); // run every minute`);
                    });
                    line('},');
                });
                line();
                indent(({ line, indent }) => {
                    line('run(){');
                    indent(({ line }) => {
                        line(`console.log('${this.inflector.dasherize(normalizedName)} job coming soon!')`);
                    });
                    line('}');
                });
                line('};');
                line();
            });

        });
    }
}

