
import { defineCommand } from 'pinstripe';

defineCommand('generate-controller', async ({
    cliUtils: { extractArg },
    fsBuilder: { inProjectRootDir, generateFile, line, indent }
}) => {
    let name = extractArg('').replace(/^\//, '');
    if(name == ''){
        console.error('A controller name must be given.');
        process.exit();
    }

    await inProjectRootDir(async () => {

        await generateFile(`lib/controllers/${name}.js`, () => {
            line();
            line(`import { defineController } from 'pinstripe';`);
            line();
            line(`defineController('${name}', ({ params, renderView, renderHtml }) => renderView('${name}', {`);
            indent(() => {
                line(`title: '${name} controller',`);
                line('body: renderHtml\`');
                indent(() => {
                    line(`<h1>${name} controller<h1></h1>`);
                });
                line('`');
            });
            line('}));');
            line();
        });
    });
});
