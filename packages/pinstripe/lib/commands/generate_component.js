
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
    
            await generateFile(`lib/components/_file_importer.js`, { skipIfExists: true }, () => {
                line();
                line(`export { Component as default } from 'pinstripe';`);
                line();
            });
    
            await generateFile(`lib/components/${normalizedName}.js`, () => {
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