
export default {
    meta(){
        this.annotate({
            description: 'Generates a new service file in the lib/services directory.'
        });
        
        this.hasParam('name', { type: 'string', alias: 'arg1', description: 'The name of the service to create (in snake_case).' });
    },

    async run(){
        const name = this.params.name;
    
        const { inProjectRootDir, generateFile } = this.fsBuilder;
    
        await inProjectRootDir(async () => {
    
            await generateFile(`lib/services/_file_importer.js`, { skipIfExists: true }, ({ line }) => {
                line();
                line(`export { ServiceFactory as default } from 'pinstripe';`);
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
