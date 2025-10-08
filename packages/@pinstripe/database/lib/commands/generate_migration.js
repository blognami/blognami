
export default {
    meta(){
        this.annotate({
            description: 'Generates a new database migration file in the lib/migrations directory.'
        });
        
        this.hasParam('suffix', { 
            type: 'string', 
            alias: 'arg1', 
            optional: true,
            description: 'The suffix for the migration name (in snake_case). If ending with "_to_tablename", the table name will be inferred.' 
        });
        
        this.hasParam('table', { 
            type: 'string', 
            optional: true, 
            description: 'The table name for the migration. Can be inferred from suffix if it ends with "_to_tablename".' 
        });
        
        this.hasParam('fields', { 
            type: 'string', 
            optional: true, 
            description: 'Field definitions for the migration (e.g., "name:string age:integer").' 
        });
    },

    async run(){

        const suffix = this.inflector.snakeify(this.params.suffix || 'migration');

        const { fields = '' } = this.params;
        const normalizedFields = this.cliUtils.normalizeFields(fields);
        
        const table = this.params.table || (() => {
            const matches = suffix.match(/_to_(.+)$/);
            if(matches){
                return matches[1];
            }
        })();

        const unixTime = Math.floor(new Date().getTime() / 1000);
        const name = `${unixTime}_${suffix}`;

        const { inProjectRootDir, generateFile } = this.fsBuilder;
    
        await inProjectRootDir(async () => {
    
            await generateFile(`lib/migrations/_file_importer.js`, { skipIfExists: true }, ({ line }) => {
                line();
                line(`export { Migration as default } from '@pinstripe/database';`);
                line();
            });
    
            await generateFile(`lib/migrations/${name}.js`, ({ line, indent }) => {
                line();
                line(`export default {`);
                indent(({ line, indent }) => {
                    line(`async migrate(){`);
                    indent(({ line, indent }) => {
                        if(table && normalizedFields.length){
                            line(`await this.database.table('${table}', async ${table} => {`);
                            indent(({ line }) => {
                                normalizedFields.forEach(({ name, type }) => {
                                    line(`await ${table}.addColumn('${name}', '${type}');`);
                                });
                            })
                            line(`});`);
                        } else {
                            line();
                        }
                    })
                    line(`}`);
                })
                line('};');
                line();
            });
        });
    }
}
