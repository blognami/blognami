
import { View, createHash } from '../view.js';
import { Client } from '../client.js'; // pinstripe-if-client: const Client = undefined;
import { fileURLToPath } from 'url'; // pinstripe-if-client: const fileURLToPath = undefined;
import { inflector } from '../inflector.js';

View.FileImporter.register('js', {
    async importFile({ filePath, relativeFilePathWithoutExtension }){
        if(relativeFilePathWithoutExtension == '_file_importer') return;

        const { default: include, decorators } = (await import(filePath));

        if(include) View.register(relativeFilePathWithoutExtension, {
            meta(){
                this.filePaths.push(filePath);
                this.include(include);
            }
        });;

        if(decorators){
            Client.instance.addModule(`
                import { Component } from ${JSON.stringify(fileURLToPath(`${import.meta.url}/../../index.js`))};
                import { createDecoratorsInclude } from ${JSON.stringify(fileURLToPath(import.meta.url))};
                import { decorators } from ${JSON.stringify(filePath)};
                const hash = ${JSON.stringify(createHash(relativeFilePathWithoutExtension))};
                Component.include(createDecoratorsInclude(hash, decorators));
            `);
        }
    }
});

export function createDecoratorsInclude(hash, decorators){
    const out = {};
    Object.keys(decorators).forEach(key => {
        out[`.view-${hash}-${inflector.dasherize(key)}`] = decorators[key];
    });
    return out;
}
