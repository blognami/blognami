
import { View } from 'sintra';
import { readFile } from 'fs/promises';

export default {
    async run(){
        const { name = '' } = this.params;
        let normalizedName = name.replace(/^\//, '');
        if(name == ''){
            console.error('A view --name must be given.');
            process.exit();
        }

        const existingFilePaths = [ ...View.for(normalizedName).filePaths ];
        const existingFilePath = existingFilePaths.pop();
        const existingFileExtension = (existingFilePath ? existingFilePath.match(/^.*\.([^\/]+)$/) : [])[1];
        if(!normalizedName.match(/\.[^\/]+$/)){
            if(existingFileExtension) {
                normalizedName = `${normalizedName}.${existingFileExtension}`;
            } else {
                normalizedName = `${normalizedName}.js`;
            }
        }

        const normalizedNameExtension = normalizedName.match(/^.*\.([^\/]+)$/)[1];

        const useExistingFile = normalizedNameExtension == existingFileExtension;
    
        const existingFileData = useExistingFile ? (await readFile(existingFilePath)).toString('utf8') : '';

        const { inProjectRootDir, generateFile } = this.fsBuilder;

        await inProjectRootDir(async () => {
    
            await generateFile(`lib/views/_file_importer.js`, { skipIfExists: true }, ({ line }) => {
                line();
                line(`export { View as default } from 'sintra';`);
                line();
            });

            await generateFile(`lib/views/${normalizedName}`, ({ echo, line, indent }) => {
                if(useExistingFile){
                    echo(existingFileData);
                } else if(normalizedNameExtension == 'js') {
                    line();
                    line('export const styles = `');
                    indent(({ line, indent }) => {
                        line(".root {");
                        indent(({ line }) => {
                            line("background: yellow;");
                        });
                        line("}");
                    });
                    line('`;');
                    line();
                    line('export default {');
                    indent(({ line, indent }) => {
                        line('render(){')
                        indent(({ line, indent }) => {
                            line('return this.renderHtml`')
                            indent(({ line, indent }) => {
                                line('<div class="${this.cssClasses.root}">');
                                indent(({ line }) => {
                                    line(`<h1>${normalizedName} view</h1>`);
                                });
                                line(`</div>`)
                            });
                            line('`;');
                        });
                        line('}');
                    });
                    line('};');
                    line();
                } else {
                    line();
                }
            });
        });
    }
};
