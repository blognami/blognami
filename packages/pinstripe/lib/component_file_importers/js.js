import { fileURLToPath } from 'url'; // pinstripe-if-client: const fileURLToPath = undefined;

import { Component } from '../component.js';
import { Bundle } from '../bundle.js'; // pinstripe-if-client: const Bundle = undefined;

Component.FileImporter.register('js', {
    meta(){
        const { importFile } = this.prototype;

        this.include({
            async importFile(){
                if(!this.isExactMatch) return;
                
                if((await import(this.filePath)).default){
                    Bundle.addModule('window', `
                        import { Component } from ${JSON.stringify(fileURLToPath(`${import.meta.url}/../../index.js`))};
                        import include from ${JSON.stringify(this.filePath)};
                        Component.register(${JSON.stringify(this.relativeFilePath.replace(/\.js$/, ''))}, include);
                    `);
                }
                
                return importFile.call(this);
            }
        });
    }
});