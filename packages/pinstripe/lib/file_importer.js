
import { Class } from './class.js';
import { Registry } from './registry.js';

export const FileImporter = Class.extend().include({
    meta(){
        this.assignProps({ name: 'FileImporter' });

        this.include(Registry);

        this.assignProps({
            async importFile(dirPath, filePath, config = { type: 'default' }){
                const { type, ...otherConfig } = config;
                const relativeFilePath = filePath.substr(dirPath.length).replace(/^\//, '');
                const relativeFilePathWithoutExtension = [relativeFilePath.replace(/\.[^/.]+$/, '')];
                const extension = relativeFilePath.replace(/^.*\./, '').split('.');

                let found = false;
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
                        found = true;
                        break;
                    }
                    relativeFilePathWithoutExtension.push(extension.shift());
                }

                if(found) return;

                await this.create(type, {
                    dirPath,
                    filePath,
                    relativeFilePath,
                    relativeFilePathWithoutExtension: relativeFilePath.replace(/\.[^/.]+$/, ''),
                    extension: relativeFilePath.replace(/^.*\./, ''),
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
