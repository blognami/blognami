
import { Class } from './class.js';
import { Registry } from './registry.js';

export const FileImporterFactory = Class.extend().include({
    meta(){
        this.assignProps({
            name: 'FileImporterFactory'
        });

        this.include(Registry);

        this.assignProps({
            importFile({ type, config, dirPath, filePath }){
                return this.create(type, config).create().importFile({ dirPath, filePath });
            }
        });
    },

    initialize(config){
        this.config = config;
    },

    create(){
        return {
            importFile: () => {
                throw new Error(`No such file importer factory "${this.constructor.name}" exists.`);
            }
        }
    }
});

FileImporterFactory.register('default', {
    create(){
        return {
            async importFile({ filePath }){
                if(!filePath.match(/\/[^\.\/]+\.js$/)) return;
                await import(filePath);
            }
        }
    }
});
