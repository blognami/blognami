
import { Class } from './class.js';
import { AbstractRegistry } from "./abstract_registry.js";

export const AbstractImportableRegistry = {
    meta(){
        this.include(AbstractRegistry);

        this.assignProps({
            get latestFilePath(){
                return this.filePaths?.at(-1) ?? null;
            },

            get FileImporter(){
                if(!this.registry.hasOwnProperty('_FileImporter')){
                    this.registry._FileImporter = Class.extend().include({
                        meta(){
                            this.include(AbstractImportableRegistry);

                            this.assignProps({
                                async importFile({ dirPath, filePath }){
                                    if(filePath.match(/\/_file_importer\.js$/)) return;
                                    const matches = filePath.match(/^.*?\.([^/]+)$/);
                                    if(!matches) return;
                                    const extension = matches[1].split('.');
                                    while(extension.length > 0){
                                        const candidateExtension = extension.join('.');
                                        if(this.mixins[candidateExtension]){
                                            await this.create(candidateExtension, { dirPath, filePath }).importFile();
                                            return;
                                        }
                                        extension.shift();
                                    }
                                    await this.create(matches[1], { dirPath, filePath }).importFile();
                                }
                            });
                        },

                        initialize({ dirPath, filePath }){
                            const relativeFilePath = filePath.substring(dirPath.length + 1);

                            const regExpEscapedExtension = this.constructor.name.replace(/\./g, '\\.')

                            this.assignProps({
                                dirPath,
                                filePath,
                                relativeFilePath: relativeFilePath,
                                relativeFilePathWithoutExtension: relativeFilePath.replace(RegExp(`\.${regExpEscapedExtension}$`), ''),
                                isExactMatch: !RegExp(`\\.[^\/]+\\.${regExpEscapedExtension}$`).test(filePath)
                            });
                        },

                        importFile(){
                            // by default do nothing
                        }
                    });

                    const that = this;
                    this.registry._FileImporter.register('js', {
                        async importFile(){
                            if(!this.isExactMatch) return;

                            const { default: _default } = await import(this.filePath);
                            if(!_default) return;

                            const { filePath } = this;

                            that.register(this.relativeFilePathWithoutExtension, {
                                meta(){
                                    this.filePaths.push(filePath);
                                    this.include(_default);
                                }
                            });
                        }
                    });
                }
                return this.registry._FileImporter;
            },

            async importFile(...args){
                await this.FileImporter.importFile(...args);
            }
        });
    }
};
