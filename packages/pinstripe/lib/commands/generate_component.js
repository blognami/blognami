
export default {
    async run(){
        const { extractArg, extractOptions } = this.cliUtils;
        const name = this.inflector.snakeify(extractArg(''));
        if(name == ''){
            console.error('A component name must be given.');
            process.exit();
        }

        const { withoutReact } = extractOptions();
    
        const { inProjectRootDir, generateFile, line, indent } = this.fsBuilder;
    
        await inProjectRootDir(async () => {
    
            await generateFile(`lib/components/_file_importer.js`, { skipIfExists: true }, () => {
                line();
                line(`export { Component as default } from 'pinstripe';`);
                line();
            });

            if(withoutReact){
                await generateFile(`lib/components/${name}.js`, () => {
                    line();
                    line(`export default {`);
                    indent(() => {
                        line(`initialize(...args){`);
                            indent(() => {
                                line(`this.constructor.parent.prototype.initialize.call(this, ...args);`);
                            });
                        line(`}`);
                    });
                    line('};');
                    line();
                });
            } else {
                const pascalizedName = this.inflector.pascalize(name);

                await generateFile(`lib/components/${name}.jsx`, () => {
                    line(`import React from 'react';`);
                    line();
                    line(`function ${pascalizedName}(){`);
                    indent(() => {
                        line(`return <>`);
                        indent(() => {
                            line(`<style>`);
                            indent(() => {
                                line('{');
                                indent(() => {
                                    line('`');
                                    indent(() => {
                                        line(`.root {`);
                                            indent(() => {
                                                line(`background: yellow;`);
                                            });
                                        line(`}`);
                                    });
                                    line('`');
                                });
                                line('}');
                            });
                            line(`</style>`)
                            line(`<div class="root">${this.inflector.dasherize(name)} component <slot /></div>`);
                        })
                        line(`</>`)
                    });
                    line(`}`);
                    line();
                    line(`export default ${pascalizedName}`);
                    line();
                });
            }
    
        });
    }
}