
import { App } from '../app.js';
import { Bundle } from '../bundle.js'; // pinstripe-if-client: const Bundle = undefined;
import { fileURLToPath } from 'url'; // pinstripe-if-client: const fileURLToPath = undefined;
import { MissingResourceError } from '../missing_resource_error.js';

App.FileImporter.register('js', {
    async importFile({ filePath, relativeFilePathWithoutExtension }){
        if(relativeFilePathWithoutExtension == '_file_importer') return;

        const { default: _default, client } = (await import(filePath));

        if(_default || client) App.register(relativeFilePathWithoutExtension, {
            meta(){
                this.filePaths.push(filePath);
                if(_default) this.include(_default);
            }
        });

        if(client) {
            Bundle.addModule('worker', `
                import { App } from ${JSON.stringify(fileURLToPath(`${import.meta.url}/../../index.js`))};
                import { ${typeof client == 'boolean' ? `default as client` : `client`} } from ${JSON.stringify(filePath)};
                App.register(${JSON.stringify(relativeFilePathWithoutExtension)}, {
                    meta(){
                        this.filePaths.push(${JSON.stringify(filePath)});
                        this.include(client);
                    }
                });
            `);
        } else {
            Bundle.addModule('worker', `
                import { App } from ${JSON.stringify(fileURLToPath(`${import.meta.url}/../../index.js`))};
                import { notAvailableOnClientApp } from ${JSON.stringify(fileURLToPath(import.meta.url))};
                App.register(${JSON.stringify(relativeFilePathWithoutExtension)}, notAvailableOnClientApp);
            `);
        }
    }
});

export const notAvailableOnClientApp =  {
    create(){
        throw new MissingResourceError(`"${this.constructor.name}" app is not available on the client`);
    }
};

