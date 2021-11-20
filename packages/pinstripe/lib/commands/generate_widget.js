
export default async ({
    cliUtils: { extractArg },
    fsBuilder: { inProjectRootDir, generateFile, line, indent },
    snakeify
}) => {
    const name = snakeify(extractArg(''));
    if(name == ''){
        console.error('A widget name must be given.');
        process.exit();
    }

    await inProjectRootDir(async () => {

        await generateFile(`lib/widgets/_importer.js`, { skipIfExists: true }, () => {
            line();
            line(`export { widgetImporter as default } from 'pinstripe';`);
            line();
        });

        await generateFile(`lib/widgets/${name}.client.js`, () => {
            line();
            line(`export default {`);
            indent(() => {
                line(`initialize(...args){`);
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
