
export default async ({
    cliUtils: { extractArg },
    fsBuilder: { inProjectRootDir, generateFile, line, indent },
    snakeify, camelize
}) => {
    const name = extractArg('');
    if(name == ''){
        console.error('A service name must be given.');
        process.exit();
    }

    await inProjectRootDir(async () => {

        await generateFile(`lib/services/_importer.js`, { skipIfExists: true }, () => {
            line();
            line(`export { serviceImporter as default } from 'pinstripe';`);
            line();
        });

        await generateFile(`lib/services/${snakeify(name)}.js`, () => {
            line();
            line(`export default () => {`);
            indent(() => {
                line(`return 'Example ${camelize(name)} service'`);
            });
            line('};');
            line();
        });

    });
};
