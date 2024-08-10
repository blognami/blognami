
import { App } from '../app.js';
import { Bundle } from '../bundle.js'; // pinstripe-if-client: const Bundle = undefined;
import { fileURLToPath } from 'url'; // pinstripe-if-client: const fileURLToPath = undefined;
import { MissingResourceError } from '../missing_resource_error.js';

App.FileImporter.register('js', {
    async importFile({ filePath, relativeFilePathWithoutExtension }){
        if(relativeFilePathWithoutExtension == '_file_importer') return;

        const { default: _default } = (await import(filePath));

        if(_default) {
            App.register(relativeFilePathWithoutExtension, {
                meta(){
                    this.filePaths.push(filePath);
                    if(_default) this.include(_default);
                }
            });

            Bundle.addModule('worker', `
                import { App } from ${JSON.stringify(fileURLToPath(`${import.meta.url}/../../index.js`))};
                import { default as client } from ${JSON.stringify(filePath)};
                App.register(${JSON.stringify(relativeFilePathWithoutExtension)}, {
                    meta(){
                        this.filePaths.push(${JSON.stringify(filePath)});
                        this.include(client);
                    }
                });
            `);
        }
    }
});

export const notAvailableOnClientApp =  {
    renderView(){
        throw new MissingResourceError(`"${this.constructor.name}" app is not available on the client`);
    }
};

