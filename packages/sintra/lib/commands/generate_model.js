
export default {
    async run(){

        const { extractArg, extractFields } = this.cliUtils;
        const name = this.inflector.snakeify(extractArg(''));
        if(name == ''){
            console.error('A model name must be given.');
            process.exit();
        }
        const fields = extractFields();
    
        const collectionName = this.inflector.camelize(this.inflector.pluralize(name));
        if(!await this.database[collectionName].exists){
            const denormalizedFields = fields.map(({ mandatory, name, type }) => {
                return `${ mandatory ? '^' : '' }${name}:${type}`
            });
            await this.runCommand('generate-migration', `create_${name}`, ...denormalizedFields, '--table', collectionName)
        }
    
        const { inProjectRootDir, generateFile, line, indent } = this.fsBuilder;
    
        await inProjectRootDir(async () => {
    
            await generateFile(`lib/models/_file_importer.js`, { skipIfExists: true }, () => {
                line();
                line(`export { Row as default } from 'sintra/database';`);
                line();
            });
    
            await generateFile(`lib/models/${name}.js`, () => {
                line();
                line(`export default {`);
                indent(() => {
                    line();
                });
                line('};');
                line();
            });
    
        });
    }
}
