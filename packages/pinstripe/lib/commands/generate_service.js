
import { defineCommand } from 'pinstripe';

defineCommand('generate-service', async ({
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

        await generateFile(`lib/services/${snakeify(name)}.js`, () => {
            line();
            line(`import { defineService } from 'pinstripe';`);
            line();
            line(`defineService('${camelize(name)}', () => {`);
            indent(() => {
                line(`return 'Example ${camelize(name)} service'`);
            });
            line('});');
            line();
        });

    });
});
