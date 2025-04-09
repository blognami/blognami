

export default {
    async run(){
        const { name = '' } = this.params;
        const normalizedName = this.inflector.snakeify(name);
        if(normalizedName == ''){
            console.error('An app --name must be given.');
            process.exit();
        }

        const { inProjectRootDir, generateFile } = this.fsBuilder;
    
        await inProjectRootDir(async () => {
    
            await generateFile(`lib/apps/_file_importer.js`, { skipIfExists: true }, ({ line }) => {
                line();
                line(`export { App as default } from 'sintra';`);
                line();
            });
    
            await generateFile(`lib/apps/${normalizedName}.js`, ({ line, indent }) => {
                line();
                line(`export default {`);
                indent(({ line, indent }) => {
                    line('compose(){');
                    indent(({ line }) => {
                        line(`return ['shared', '${this.inflector.dasherize(normalizedName)}'];`);
                    });
                    line('}');
                });
                line('};');
                line();
            });
    
        });

        await this.runCommand('generate-view', {
            name: `${normalizedName}/index`
        });
    }
}

