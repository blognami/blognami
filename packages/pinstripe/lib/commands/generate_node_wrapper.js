
export default async ({
    cliUtils: { extractArg },
    fsBuilder: { inProjectRootDir, generateFile, line, indent },
    snakeify
}) => {
    const name = snakeify(extractArg(''));
    if(name == ''){
        console.error('A node wrapper name must be given.');
        process.exit();
    }

    await inProjectRootDir(async () => {

        await generateFile(`lib/node_wrappers/_importer.js`, { skipIfExists: true }, () => {
            line();
            line(`export { nodeWrapperImporter as default } from 'pinstripe';`);
            line();
        });

        await generateFile(`lib/node_wrappers/${name}.client.js`, () => {
            line();
            line(`export default {`);
            indent(() => {
                line(`initialize(){`);
                    indent(() => {
                        line(`this.constructor.parent.prototype.initialize.call(this, ...args);`);
                    });
                line(`}`);
            });
            line('};');
            line();
        });

    });
};
