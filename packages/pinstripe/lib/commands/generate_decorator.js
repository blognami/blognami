
export default async ({
    cliUtils: { extractArg },
    fsBuilder: { inProjectRootDir, generateFile, line, indent },
    snakeify
}) => {
    const name = snakeify(extractArg(''));
    if(name == ''){
        console.error('A decorator name must be given.');
        process.exit();
    }

    await inProjectRootDir(async () => {

        await generateFile(`lib/decorators/_importer.js`, { skipIfExists: true }, () => {
            line();
            line(`export { decoratorImporter as default } from 'pinstripe';`);
            line();
        });

        await generateFile(`lib/decorators/${name}.client.js`, () => {
            line();
            line(`export default {`);
            indent(() => {
                line(`decorate(){`);
                    indent(() => {
                        line();
                    });
                line(`}`);
            });
            line('};');
            line();
        });

    });
};
