

export default {
    meta(){
        this.annotate({
            description: 'Generates a new command file in the lib/commands directory.'
        });
        
        this.hasParam('name', { type: 'string', alias: 'arg1', description: 'The name of the command to create (in snake_case).' });
    },

    async run(){
        const normalizedName = this.inflector.snakeify(this.params.name);

        const { inProjectRootDir, generateFile } = this.fsBuilder;
    
        await inProjectRootDir(async () => {
    
            await generateFile(`lib/commands/_file_importer.js`, { skipIfExists: true }, ({ line }) => {
                line();
                line(`export { Command as default } from 'pinstripe';`);
                line();
            });
    
            await generateFile(`lib/commands/${normalizedName}.js`, ({ line, indent }) => {
                line();
                line(`export default {`);
                indent(({ line, indent }) => {
                    line('run(){');
                    indent(({ line }) => {
                        line(`console.log('${this.inflector.dasherize(normalizedName)} command coming soon!')`);
                    });
                    line('}');
                });
                line('};');
                line();
            });
    
        });
    }
}

