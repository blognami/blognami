
export default {
    async run(){

        const name = this.inflector.snakeify(this.params.name || '');
        if(name == ''){
            console.error('A model --name must be given.');
            process.exit();
        }

        let { fields = '' } = this.params;

        const collectionName = this.inflector.camelize(this.inflector.pluralize(name));
        if(!await this.database[collectionName]){
            await this.runCommand('generate-migration', { suffix: `create_${name}`, fields, table: collectionName});
        }
    
        const { inProjectRootDir, generateFile } = this.fsBuilder;
    
        await inProjectRootDir(async () => {
    
            await generateFile(`lib/models/_file_importer.js`, { skipIfExists: true }, ({ line }) => {
                line();
                line(`export { Row as default } from '@sintra/database';`);
                line();
            });
    
            await generateFile(`lib/models/${name}.js`, ({ line, indent }) => {
                line();
                line(`export default {`);
                indent(({ line }) => {
                    line();
                });
                line('};');
                line();
            });
    
        });
    }
}
