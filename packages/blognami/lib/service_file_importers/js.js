
import { ServiceFactory } from '../service_factory.js';
import { Bundle } from '../bundle.js'; // blognami-if(client): const Bundle = undefined;
import { fileURLToPath } from 'url'; // blognami-if(client): const fileURLToPath = undefined;
import { MissingResourceError } from '../missing_resource_error.js';

ServiceFactory.FileImporter.register('js', {
    meta(){
        const { importFile } = this.prototype;

        this.include({
            async importFile(){
                await importFile.call(this);

                const { filePath, relativeFilePathWithoutExtension } = this;

                Bundle.addModule('clientServiceWorker', `
                    import { ServiceFactory } from ${JSON.stringify(fileURLToPath(`${import.meta.url}/../../index.js`))};
                    ServiceFactory.register(${JSON.stringify(relativeFilePathWithoutExtension)}, {});
                `);

                const addToClient = ServiceFactory.for(relativeFilePathWithoutExtension)._addToClient;

                if(addToClient) Bundle.addModule('clientServiceWorker', `
                    import { ServiceFactory } from ${JSON.stringify(fileURLToPath(`${import.meta.url}/../../index.js`))};
                    import { default as _default } from ${JSON.stringify(filePath)};
                    ServiceFactory.register(${JSON.stringify(relativeFilePathWithoutExtension)}, {
                        meta(){
                            this.filePaths.push(${JSON.stringify(filePath)});
                            this.include(_default);
                        }
                    });
                `);

                // A file such as a test (name.test.js) registers no service on Node, so it has no default export to build in.
                if(this.isExactMatch) Bundle.addModule('serviceWorker', `
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

if(Bundle) // blognami-if(server,service-worker): if(false) // kept out: import.meta.url is undefined in a Durable Object
Bundle.addModule('clientServiceWorker', `
    import { ServiceFactory } from ${JSON.stringify(fileURLToPath(`${import.meta.url}/../../index.js`))};
    import { notAvailableOnClientServiceFactory } from ${JSON.stringify(fileURLToPath(import.meta.url))};
    ServiceFactory.include(notAvailableOnClientServiceFactory);
`);

export const notAvailableOnClientServiceFactory =  {
    create(){
        throw new MissingResourceError(`"${this.constructor.name}" service factory is not available on the client`);
    }
};
