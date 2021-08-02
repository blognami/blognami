
import { defineCommand } from 'pinstripe';

defineCommand('generate-view', async ({
    cliUtils: { extractArg },
    fsBuilder: { inProjectRootDir, generateFile, line, indent }
}) => {
    let name = extractArg('').replace(/^\//, '');
    if(name == ''){
        console.error('A view name must be given.');
        process.exit();
    }

    if(!name.match(/\.[^\/]+$/)){
        name = `${name}.tpl.js`;
    }

    await inProjectRootDir(async () => {
        
        await generateFile(`lib/web/_importer.js`, { skipIfExists: true }, () => {
            line();
            line(`export { webImporter as default } from 'pinstripe';`);
            line();
        });

        await generateFile(`lib/web/${name}`, () => {
            line();
            line('export default ({ renderHtml, params }) => renderHtml(`');
            indent(() => {
                line(`<h1>${name} view<h1></h1>`);
            });
            line('`);');
            line();
        });
    });
});
