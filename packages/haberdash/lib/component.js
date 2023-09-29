

import { Component, path } from 'pinstripe/internal';
import { fileURLToPath } from 'url'; // haberdash-if-client: const fileURLToPath = undefined;

import { Client } from './client.js'; // haberdash-if-client: const Client = undefined;
import { importAll } from './import_all.js';
import { IS_SERVER } from './constants.js';

Component.include({
    meta(){
        this.FileImporter.register('js', {
            meta(){
                const { importFile } = this.prototype;

                this.include({
                    async importFile(params){
                        const { filePath, relativeFilePathWithoutExtension } = params;
                        if((await import(filePath)).default){
                            Client.instance.addModule(`
                                import { Component } from ${JSON.stringify(fileURLToPath(`${import.meta.url}/../index.js`))};
                                import include from ${JSON.stringify(filePath)};
                                Component.register(${JSON.stringify(relativeFilePathWithoutExtension)}, include);
                            `);
                        } else {
                            Client.instance.addModule(`
                                import ${JSON.stringify(filePath)};
                            `);
                        }
                        return importFile.call(this, params);
                    }
                })
            }
        });
    }
});

if(IS_SERVER) importAll(path);

export { Component } from 'pinstripe/internal';