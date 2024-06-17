
export default {
    async run(){

        const name = this.inflector.snakeify(this.params.name || '');
        if(name == ''){
            console.error('A model --name must be given.');
            process.exit();
        }

        let { fields = '' } = this.params;

        fields = fields.split(/\s+/).map(field => field.trim()).filter(field => field).map(arg => {
            const matches = arg.match(/^(\^|)([^:]*)(:|)(.*)$/);
            const mandatory = matches[1] == '^';
            const name = this.inflector.camelize(matches[2]);
            const type =  matches[4] || 'string';
            return {
                mandatory,
                name,
                type
            };
        });
    
        const collectionName = this.inflector.camelize(this.inflector.pluralize(name));
        if(!await this.database[collectionName]){
            const denormalizedFields = fields.map(({ mandatory, name, type }) => {
                return `${ mandatory ? '^' : '' }${name}:${type}`
            });
            await this.runCommand('generate-migration', `create_${name}`, ...denormalizedFields, '--table', collectionName)
        }
    
        const { inProjectRootDir, generateFile, line, indent } = this.fsBuilder;
    
        await inProjectRootDir(async () => {
    
            await generateFile(`lib/models/_file_importer.js`, { skipIfExists: true }, () => {
                line();
                line(`export { Row as default } from 'pinstripe/database';`);
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
