
import { Class } from './class.js';
import { Registry } from './registry.js';

export const FileImporter = Class.extend().include({
    meta(){
        this.assignProps({ name: 'FileImporter' });

        this.include(Registry);

        this.assignProps({
            async importFile(dirPath, filePath, config){
                const { type, ...otherConfig } = config;
                const relativeFilePath = filePath.substr(dirPath.length).replace(/^\//, '');
                const relativeFilePathWithoutExtension = [relativeFilePath.replace(/\.[^/]+$/, '')];
                const extension = relativeFilePath.replace(/^.*?\.([^/]+)$/, '$1').split('.');

                while(extension.length > 0){
                    const candidateImporterName = `${type}.${extension.join('.')}`;
                    if(this.mixins[candidateImporterName]){
                        await this.create(candidateImporterName, {
                            dirPath,
                            filePath,
                            relativeFilePath,
                            relativeFilePathWithoutExtension: relativeFilePathWithoutExtension.join('.'),
                            extension: extension.join('.'),
                            config: otherConfig
                        }).importFile();
                        return;
                    }
                    relativeFilePathWithoutExtension.push(extension.shift());
                }

                await this.create(type, {
                    dirPath,
                    filePath,
                    relativeFilePath,
                    relativeFilePathWithoutExtension: relativeFilePath.replace(/\.[^/.]+$/, ''),
                    extension: relativeFilePath.replace(/^.*?\.([^/]+)$/, '$1'),
                    config: otherConfig
                }).importFile();
            }
        });
    },

    initialize({ dirPath, filePath, relativeFilePath, relativeFilePathWithoutExtension, extension, config }){
        this.dirPath = dirPath;
        this.filePath = filePath;
        this.relativeFilePath = relativeFilePath;
        this.relativeFilePathWithoutExtension = relativeFilePathWithoutExtension;
        this.extension = extension;
        this.config = config
    },

    importFile(){
        // by default do nothing
    }
});
