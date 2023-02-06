
import { Component } from "pinstripe";
import { fileURLToPath } from 'url'; // sintra-if-client: const fileURLToPath = undefined;

import { Client } from './client.js'; // sintra-if-client: const Client = undefined;

Component.include({
    meta(){
        const { importFile } = this;

        this.assignProps({
            async importFile(params){
                const { filePath, relativeFilePathWithoutExtension } = params;
                if((await import(filePath)).default){
                    Client.instance.addModule(`
                        import { Component } from ${JSON.stringify(fileURLToPath(`${import.meta.url}/../index.js`))};
                        import include from ${JSON.stringify(filePath)};
                        Component.register(${JSON.stringify(relativeFilePathWithoutExtension)}, include);
                    `);
                }
                return importFile.call(this, params);
            }
        });
    }
});

export { Component } from "pinstripe";
