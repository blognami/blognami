

export default {
    async run(){
        const { name = '' } = this.params;
        const normalizedName = this.inflector.snakeify(name);
        if(normalizedName == ''){
            console.error('A command --name must be given.');
            process.exit();
        }

        const { inProjectRootDir, generateFile, line, indent } = this.fsBuilder;
    
        await inProjectRootDir(async () => {
    
            await generateFile(`lib/commands/_file_importer.js`, { skipIfExists: true }, () => {
                line();
                line(`export { Command as default } from 'blognami';`);
                line();
            });
    
            await generateFile(`lib/commands/${normalizedName}.js`, () => {
                line();
                line(`export default {`);
                indent(() => {
                    line('run(){');
                    indent(() => {
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

