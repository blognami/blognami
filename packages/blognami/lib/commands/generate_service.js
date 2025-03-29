
export default {
    async run(){
        const { name = '' } = this.params;
        if(name == ''){
            console.error('A service --name must be given.');
            process.exit();
        }
    
        const { inProjectRootDir, generateFile } = this.fsBuilder;
    
        await inProjectRootDir(async () => {
    
            await generateFile(`lib/services/_file_importer.js`, { skipIfExists: true }, ({ line }) => {
                line();
                line(`export { ServiceFactory as default } from 'blognami';`);
                line();
            });
    
            await generateFile(`lib/services/${this.inflector.snakeify(name)}.js`, ({ line, indent }) => {
                line(`export default {`);
                indent(({ line, indent }) => {
                    line('create(){');
                    indent(({ line }) => {
                        line(`return 'Example ${this.inflector.camelize(name)} service'`);
                    });
                    line('}');
                });
                line('};');
            });
    
        });
    }
};
