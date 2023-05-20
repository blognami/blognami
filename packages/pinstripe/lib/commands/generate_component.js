
export default {
    async run(){
        const { extractArg } = this.cliUtils;
        const name = this.inflector.snakeify(extractArg(''));
        if(name == ''){
            console.error('A component name must be given.');
            process.exit();
        }
    
        const { inProjectRootDir, generateFile, line, indent } = this.fsBuilder;
    
        await inProjectRootDir(async () => {
    
            await generateFile(`lib/components/_file_importer.js`, { skipIfExists: true }, () => {
                line();
                line(`export { Component as default } from 'pinstripe';`);
                line();
            });

            await generateFile(`lib/components/${name}.js`, () => {
                line();
                line(`export default {`);
                indent(() => {
                    line(`initialize(...args){`);
                        indent(() => {
                            line(`this.constructor.parent.prototype.initialize.call(this, ...args);`);
                            line();
                            line('this.shadow.patch(`');
                            indent(() => {
                                line(`<style>`);
                                indent(() => {
                                    line(`.root {`);
                                    indent(() => {
                                        line(`background: yellow;`)
                                    })
                                    line(`}`);
                                });
                                line(`</style>`);
                                line(`<div class="root"><slot></div>`);
                            });
                            line('`);');
                        });
                    line(`}`);
                });
                line('};');
                line();
            });
        });
    }
}