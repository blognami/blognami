
import { defineCommand } from 'pinstripe';

defineCommand('generate-widget', async ({
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

        await generateFile(`lib/widgets/${name}.js`, () => {
            line();
            line(`import { Widget } from 'pinstripe';`);
            line();
            line(`Widget.define('${name}').props({`);
            indent(() => {
                line();
            });
            line('});');
            line();
        });

    });
});
