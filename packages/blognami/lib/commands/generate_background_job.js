

export default {
    async run(){
        const { name = '' } = this.params;
        const normalizedName = this.inflector.snakeify(name);
        if(normalizedName == ''){
            console.error('A background job --name must be given.');
            process.exit();
        }

        const { inProjectRootDir, generateFile, line, indent } = this.fsBuilder;
    
        await inProjectRootDir(async () => {
    
            await generateFile(`lib/background_jobs/_file_importer.js`, { skipIfExists: true }, () => {
                line();
                line(`export { BackgroundJob as default } from 'blognami';`);
                line();
            });
    
            await generateFile(`lib/background_jobs/${normalizedName}.js`, () => {
                line();
                line(`export default {`);
                indent(() => {
                    line('meta(){');
                    indent(() => {
                        line(`this.schedule('* * * * *'); // run every minute`);
                    });
                    line('}');
                });
                line();
                indent(() => {
                    line('run(){');
                    indent(() => {
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

