

export default {
    async run(){
        const { name = '' } = this.params;
        const normalizedName = this.inflector.snakeify(name);
        if(normalizedName == ''){
            console.error('A background job --name must be given.');
            process.exit();
        }

        const { inProjectRootDir, generateFile } = this.fsBuilder;
    
        await inProjectRootDir(async () => {
    
            await generateFile(`lib/background_jobs/_file_importer.js`, { skipIfExists: true }, ({ line }) => {
                line();
                line(`export { BackgroundJob as default } from 'sintra';`);
                line();
            });
    
            await generateFile(`lib/background_jobs/${normalizedName}.js`, ({ line, indent }) => {
                line();
                line(`export default {`);
                indent(({ line, indent }) => {
                    line('meta(){');
                    indent(({ line }) => {
                        line(`this.schedule('* * * * *'); // run every minute`);
                    });
                    line('}');
                });
                line();
                indent(({ line, indent }) => {
                    line('run(){');
                    indent(({ line }) => {
                        line(`console.log('${this.inflector.dasherize(normalizedName)} background job coming soon!')`);
                    });
                    line('}');
                });
                line('};');
                line();
            });
    
        });
    }
}

