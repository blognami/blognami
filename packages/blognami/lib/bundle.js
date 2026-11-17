import { fileURLToPath } from 'url';

import { Class } from './class.js';
import { AbstractImportableRegistry } from 'haberdash';

export const Bundle = Class.extend().include({
    meta(){
        this.include(AbstractImportableRegistry);

        this.assignProps({
            get modules(){
                if(!this.hasOwnProperty('_modules')){
                    this._modules = [];
                }
                return this._modules;
            },

            addModule(environment, module){
                this.register(environment, {
                    meta(){
                        this.modules.push(module);
                    }
                });
            },
        });
    }
});

const flags = {
    window: ['client', 'window'],
    clientServiceWorker: ['client', 'serviceWorker'],
    serviceWorker: ['server', 'serviceWorker']
};

Object.keys(flags).forEach(environment => {
    Bundle.register(environment, {
        meta(){
            this.assignProps({ flags: flags[environment] });
        }
    });
    Bundle.addModule(environment, `import ${JSON.stringify(fileURLToPath(`${import.meta.url}/../index.js`))};`); // blognami-if(server,service-worker): // kept out: import.meta.url is undefined in a Durable Object, and nothing is bundled there
});

// The filesystem walk does not run in the server service worker, so each registration is built in statically.
export function addFileImportsToServiceWorkerBundle(Registry, exportName, registryUrl){
    Registry.FileImporter.register('js', {
        meta(){
            const { importFile } = this.prototype;

            this.include({
                async importFile(){
                    await importFile.call(this);

                    const { filePath, relativeFilePathWithoutExtension } = this;

                    if(!this.isExactMatch || !(await import(filePath)).default) return;

                    Bundle.addModule('serviceWorker', `
                        import { ${exportName} } from ${JSON.stringify(fileURLToPath(registryUrl))};
                        import { default as _default } from ${JSON.stringify(filePath)};
                        ${exportName}.register(${JSON.stringify(relativeFilePathWithoutExtension)}, {
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
}
