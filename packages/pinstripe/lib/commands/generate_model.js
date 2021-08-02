
import { defineCommand } from 'pinstripe';

defineCommand('generate-model', async ({
    cliUtils: { extractArg, extractFields },
    fsBuilder: { inProjectRootDir, generateFile, line, indent },
    snakeify, pluralize, camelize,
    database,
    rundefineCommand
}) => {
    const name = snakeify(extractArg(''));
    if(name == ''){
        console.error('A model name must be given.');
        process.exit();
    }

    const fields = extractFields();

    const collectionName = camelize(pluralize(name));
    if(!await database[collectionName].exists){
        const denormalizedFields = fields.map(({ mandatory, name, type }) => {
            return `${ mandatory ? '^' : '' }${name}:${type}`
        });
        await rundefineCommand('generate-migration', `create_${name}`, ...denormalizedFields, '--table', collectionName)
    }

    await inProjectRootDir(async () => {

        await generateFile(`lib/models/${name}.js`, () => {
            line();
            line(`import { Model } from 'pinstripe';`);
            line();
            line(`Model.define('${name}').open(Class => Class`);
            indent(() => {
                line();
            });
            line(');');
            line();
        });

    });
});
