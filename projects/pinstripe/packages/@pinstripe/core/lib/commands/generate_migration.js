
import { command } from '../command.js';
import { Inflector } from '../inflector.js';

command('generate-migration', async ({
    cliUtils: { extractArg, extractFields, extractOptions },
    fsBuilder: { generateFile, line, indent }
}) => {
    const suffix = Inflector.snakeify(extractArg('migration'));
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

    await generateFile(`lib/migrations/_importer.js`, { skipIfExists: true }, () => {
        line();
        line(`export { migrationImporter as default } from 'pinstripe';`);
        line();
    });

    await generateFile(`lib/migrations/${name}.js`, () => {
        line();
        if(table){
            line(`export default async ({ database: { ${table} } }) => {`);
        } else {
            line(`export default async ({ database }) => {`);
        }
        indent(() => {
            line();
            if(table && fields.length){
                fields.forEach(({ name, type }) => {
                    line(`await ${table}.addColumn('${name}', '${type}');`);
                });
                line();
            }
        })
        line('};');
        line();
    });
})
