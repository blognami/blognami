
export default {
    meta(){
        this.annotate({
            description: 'Generates a new model file in the lib/models directory and creates an associated migration if needed.'
        });
        
        this.hasParam('name', { 
            type: 'string', 
            alias: 'arg1', 
            description: 'The name of the model to create (in snake_case).' 
        });
        
        this.hasParam('fields', { 
            type: 'string', 
            optional: true, 
            description: 'Field definitions for the model\'s table (e.g., "name:string age:integer").' 
        });
    },

    async run(){

        const name = this.inflector.snakeify(this.params.name);

        let { fields = '' } = this.params;

        const collectionName = this.inflector.camelize(this.inflector.pluralize(name));
        if(!await this.database[collectionName]){
            await this.runCommand('generate-migration', { suffix: `create_${name}`, fields, table: collectionName});
        }
    
        const { inProjectRootDir, generateFile } = this.fsBuilder;
    
        await inProjectRootDir(async () => {
    
            await generateFile(`lib/models/_file_importer.js`, { skipIfExists: true }, ({ line }) => {
                line();
                line(`export { Row as default } from '@pinstripe/database';`);
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
