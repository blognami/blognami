
export default {
    async run(){
        const [ name = '' ] = this.args;
        const normalizedName = this.inflector.snakeify(name);
        if(normalizedName == ''){
            console.error('A node wrapper name must be given.');
            process.exit();
        }
    
        const { inProjectRootDir, generateFile, line, indent } = this.fsBuilder;
    
        await inProjectRootDir(async () => {
    
            await generateFile(`lib/node_wrappers/_importer.js`, { skipIfExists: true }, () => {
                line();
                line(`export { componentImporter as default } from 'pinstripe';`);
                line();
            });
    
            await generateFile(`lib/node_wrappers/${normalizedName}.client.js`, () => {
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
    }
}