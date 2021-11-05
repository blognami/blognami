
export default async ({
    cliUtils: { extractArg },
    fsBuilder: { inProjectRootDir, generateFile, line, indent },
    snakeify, dasherize
}) => {
    const name = snakeify(extractArg(''));
    if(name == ''){
        console.error('A command name must be given.');
        process.exit();
    }

    await inProjectRootDir(async () => {

        await generateFile(`lib/commands/_importer.js`, { skipIfExists: true }, () => {
            line();
            line(`export { commandImporter as default } from 'pinstripe';`);
            line();
        });

        await generateFile(`lib/commands/${name}.js`, () => {
            line();
            line(`export default () => {`);
            indent(() => {
                line(`console.log('${dasherize(name)} command coming soon!')`);
            });
            line('};');
            line();
        });

    });
};
