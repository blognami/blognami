
import { ServiceFactory } from '../service_factory.js';
import { Bundle } from '../bundle.js'; // pinstripe-if-client: const Bundle = undefined;
import { fileURLToPath } from 'url'; // pinstripe-if-client: const fileURLToPath = undefined;
import { MissingResourceError } from '../missing_resource_error.js';

ServiceFactory.FileImporter.register('js', {
    meta(){
        const { importFile } = this.prototype;

        this.include({
            async importFile(){
                await importFile.call(this);

                const { filePath, relativeFilePathWithoutExtension } = this;

                Bundle.addModule('serviceWorker', `
                    import { ServiceFactory } from ${JSON.stringify(fileURLToPath(`${import.meta.url}/../../index.js`))};
                    ServiceFactory.register(${JSON.stringify(relativeFilePathWithoutExtension)}, {});
                `);

                const addToClient = ServiceFactory.for(relativeFilePathWithoutExtension)._addToClient;

                if(addToClient) Bundle.addModule('serviceWorker', `
                    import { ServiceFactory } from ${JSON.stringify(fileURLToPath(`${import.meta.url}/../../index.js`))};
                    import { default as _default } from ${JSON.stringify(filePath)};
                    ServiceFactory.register(${JSON.stringify(relativeFilePathWithoutExtension)}, {
                        meta(){
                            this.filePaths.push(${JSON.stringify(filePath)});
                            this.include(_default);
                        }
                    });
                `);
            }
        });
    }
});

if(Bundle) Bundle.addModule('serviceWorker', `
    import { ServiceFactory } from ${JSON.stringify(fileURLToPath(`${import.meta.url}/../../index.js`))};
    import { notAvailableOnClientServiceFactory } from ${JSON.stringify(fileURLToPath(import.meta.url))};
    ServiceFactory.include(notAvailableOnClientServiceFactory);
`);

export const notAvailableOnClientServiceFactory =  {
    create(){
        throw new MissingResourceError(`"${this.constructor.name}" service factory is not available on the client`);
    }
};
