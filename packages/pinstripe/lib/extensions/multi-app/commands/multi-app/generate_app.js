
export default {
    async run(){
        const { name = '' } = this.params;
        let normalizedName = name.replace(/^\//, '');
        if(name == ''){
            console.error('An app --name must be given.');
            process.exit();
        }

        const { inProjectRootDir, generateFile, line, indent } = this.fsBuilder;

        await inProjectRootDir(async () => {
    
            await generateFile(`lib/views/_file_importer.js`, { skipIfExists: true }, () => {
                line();
                line(`export { View as default } from 'pinstripe';`);
                line();
            });

            await generateFile(`lib/views/_apps/${normalizedName}/default.js`, () => {
                line();
                line(`export default {`);
                    indent(() => {
                        line(`async render(){`);
                            line(`const { _url } = this.params;`);
                            line();
                            line(`_url.pathname = _url.pathname.replace(/^\\/_apps\\/[^/]+/, '');`);
                            line();
                            line(`if (!_url.pathname.match(/^\\/_pinstripe\\//)) return this.renderView('_404');`);
                            line();
                            line(`return this.callHandler.handleCall(this.params);`);
                        line(`}`);
                    });
                line(`};`);
                line();
            });
        });
    }
};
