
export default async ({
    cliUtils: { extractArg, extractFields, extractOptions },
    fsBuilder: { inProjectRootDir, generateFile, line, indent },
    snakeify
}) => {
    const suffix = snakeify(extractArg('migration'));
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

    await inProjectRootDir(async () => {

        await generateFile(`lib/migrations/_importer.js`, { skipIfExists: true }, () => {
            line();
            line(`export { migrationImporter as default } from 'pinstripe';`);
            line();
        });

        await generateFile(`lib/migrations/${name}.js`, () => {
            line();
            line(`export default async ({ database }) => {`);
            indent(() => {
                line();
                if(table && fields.length){
                    fields.forEach(({ name, type }) => {
                        line(`await database.${table}.addColumn('${name}', '${type}');`);
                    });
                    line();
                }
            })
            line('};');
            line();
        });
    });
};
