
import { ServiceFactory } from '../service_factory.js';
import { Bundle } from '../bundle.js'; // sintra-if-client: const Bundle = undefined;
import { fileURLToPath } from 'url'; // sintra-if-client: const fileURLToPath = undefined;

ServiceFactory.FileImporter.register('client.js', {
    meta(){
        this.include('js');

        const { importFile } = this.prototype;

        this.include({
            async importFile(){
                await importFile.call(this);

                const { filePath, relativeFilePathWithoutExtension } = this;

                Bundle.addModule('serviceWorker', `
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
