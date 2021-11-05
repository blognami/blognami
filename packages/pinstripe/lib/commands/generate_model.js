
export default async ({
    cliUtils: { extractArg, extractFields },
    fsBuilder: { inProjectRootDir, generateFile, line, indent },
    snakeify, pluralize, camelize,
    database,
    runCommand
}) => {
    const name = snakeify(extractArg(''));
    if(name == ''){
        console.error('A model name must be given.');
        process.exit();
    }

    const fields = extractFields();

    const collectionName = camelize(pluralize(name));
    if(!await database[collectionName].exists()){
        const denormalizedFields = fields.map(({ mandatory, name, type }) => {
            return `${ mandatory ? '^' : '' }${name}:${type}`
        });
        await runCommand('generate-migration', `create_${name}`, ...denormalizedFields, '--table', collectionName)
    }

    await inProjectRootDir(async () => {

        await generateFile(`lib/models/_importer.js`, { skipIfExists: true }, () => {
            line();
            line(`export { modelImporter as default } from 'pinstripe';`);
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
};
