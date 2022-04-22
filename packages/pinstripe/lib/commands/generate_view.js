
export default async ({
    cliUtils: { extractArg },
    fsBuilder: { inProjectRootDir, generateFile, line, indent },
    app
}) => {
    let name = extractArg('').replace(/^\//, '');
    if(name == ''){
        console.error('A view name must be given.');
        process.exit();
    }

    if(!name.match(/\.[^\/]+$/)){
        name = `${name}.js`;
    }

    await inProjectRootDir(async () => {

        await generateFile(`lib/views/_importer.js`, { skipIfExists: true }, () => {
            line();
            line(`export { viewImporter as default } from 'pinstripe';`);
            line();
        });

        await generateFile(`lib/views/${await app}/${name}`, () => {
            line();
            line('export default ({ renderHtml, params }) => renderHtml(`');
            indent(() => {
                line(`<h1>${name} view<h1></h1>`);
            });
            line('`);');
            line();
        });
    });
};
