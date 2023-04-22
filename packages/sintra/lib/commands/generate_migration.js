
export default {
    async run(){
        const { extractArg, extractFields, extractOptions } = this.cliUtils;

        const suffix = this.inflector.snakeify(extractArg('migration'));
        const fields = extractFields();
        const { table } = extractOptions({
            table: (() => {
                const matches = suffix.match(/_to_(.+)$/);
                if(matches){
                    return matches[1];
                }
            })()
        });

        const unixTime = Math.floor(new Date().getTime() / 1000);
        const name = `${unixTime}_${suffix}`;

        const { inProjectRootDir, generateFile, line, indent } = this.fsBuilder;
    
        await inProjectRootDir(async () => {
    
            await generateFile(`lib/migrations/_file_importer.js`, { skipIfExists: true }, () => {
                line();
                line(`export { Migration as default } from 'sintra/database';`);
                line();
            });
    
            await generateFile(`lib/migrations/${name}.js`, () => {
                line();
                line(`export default {`);
                indent(() => {
                    line(`async migrate(){`);
                    indent(() => {
                        if(table && fields.length){
                            line(`await this.database.table('${table}', async ${table} => {`);
                            indent(() => {
                                fields.forEach(({ name, type }) => {
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
