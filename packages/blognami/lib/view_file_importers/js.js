
import { View, createHash } from '../view.js';
import { Bundle } from '../bundle.js'; // blognami-if-client: const Bundle = undefined;
import { fileURLToPath } from 'url'; // blognami-if-client: const fileURLToPath = undefined;
import { inflector } from '../inflector.js';

View.FileImporter.register('js', {
    async importFile(){
        const { filePath, relativeFilePathWithoutExtension } = this;

        const { default: _default, client, decorators } = (await import(filePath));

        if(_default || client) View.register(relativeFilePathWithoutExtension, {
            meta(){
                this.filePaths.push(filePath);
                if(_default) this.include(_default);
            }
        });

        if(client) {
            Bundle.addModule('worker', `
                import { View } from ${JSON.stringify(fileURLToPath(`${import.meta.url}/../../index.js`))};
                import { ${typeof client == 'boolean' ? `default as client` : `client`} } from ${JSON.stringify(filePath)};
                View.register(${JSON.stringify(relativeFilePathWithoutExtension)}, {
                    meta(){
                        this.filePaths.push(${JSON.stringify(filePath)});
                        this.include(client);
                    }
                });
            `);
        }

        if(decorators){
            Bundle.addModule('window', `
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
