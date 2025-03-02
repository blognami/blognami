
export default {
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

        const { inProjectRootDir, generateFile, line, indent } = this.fsBuilder;
    
        await inProjectRootDir(async () => {
    
            await generateFile(`lib/migrations/_file_importer.js`, { skipIfExists: true }, () => {
                line();
                line(`export { Migration as default } from 'blognami/database';`);
                line();
            });
    
            await generateFile(`lib/migrations/${name}.js`, () => {
                line();
                line(`export default {`);
                indent(() => {
                    line(`async migrate(){`);
                    indent(() => {
                        if(table && normalizedFields.length){
                            line(`await this.database.table('${table}', async ${table} => {`);
                            indent(() => {
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
