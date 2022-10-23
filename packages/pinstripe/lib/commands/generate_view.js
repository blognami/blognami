
export default {
    async run(){
        const [ name = '' ] = this.args;
        let normalizedName = name.replace(/^\//, '');
        if(name == ''){
            console.error('A view name must be given.');
            process.exit();
        }
    
        if(!normalizedName.match(/\.[^\/]+$/)){
            normalizedName = `${normalizedName}.js`;
        }
    
        const { inProjectRootDir, generateFile, line, indent } = this.fsBuilder;
    
        await inProjectRootDir(async () => {
    
            await generateFile(`lib/views/_importer.js`, { skipIfExists: true }, () => {
                line();
                line(`export { viewImporter as default } from 'pinstripe';`);
                line();
            });
    
            await generateFile(`lib/views/${normalizedName}`, () => {
                line();
                line('export default ({ renderHtml, params }) => renderHtml(`');
                indent(() => {
                    line(`<h1>${normalizedName} view<h1></h1>`);
                });
                line('`);');
                line();
            });
        });
    }
};
