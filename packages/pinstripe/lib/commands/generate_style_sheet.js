
export default async ({
    cliUtils: { extractArg },
    fsBuilder: { inProjectRootDir, generateFile, line, indent },
    snakeify
}) => {
    const name = extractArg('');
    if(name == ''){
        console.error('A style sheet name must be given.');
        process.exit();
    }

    await inProjectRootDir(async () => {

        await generateFile(`lib/style_sheets/_importer.js`, { skipIfExists: true }, () => {
            line();
            line(`export { styleSheetImporter as default } from 'pinstripe';`);
            line();
        });

        await generateFile(`lib/style_sheets/${snakeify(name)}.js`, () => {
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
