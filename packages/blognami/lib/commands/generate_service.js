
export default {
    async run(){
        const { name = '' } = this.params;
        if(name == ''){
            console.error('A service --name must be given.');
            process.exit();
        }
    
        const { inProjectRootDir, generateFile, line, indent } = this.fsBuilder;
    
        await inProjectRootDir(async () => {
    
            await generateFile(`lib/services/_file_importer.js`, { skipIfExists: true }, () => {
                line();
                line(`export { ServiceFactory as default } from 'blognami';`);
                line();
            });
    
            await generateFile(`lib/services/${this.inflector.snakeify(name)}.js`, () => {
                line(`export default {`);
                indent(() => {
                    line('create(){');
                    indent(() => {
                        line(`return 'Example ${this.inflector.camelize(name)} service'`);
                    });
                    line('}');
                });
                line('};');
            });
    
        });
    }
};
