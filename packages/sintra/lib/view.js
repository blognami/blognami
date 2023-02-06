import { Class, Registry } from 'haberdash';
import { promisify } from 'util'; // sintra-if-client: const promisify = undefined;
import { readFile } from 'fs'; // sintra-if-client: const readFile = undefined;
import { default as mimeTypes } from 'mime-types'; // sintra-if-client: const mimeTypes = undefined;

import { ServiceConsumer } from './service_consumer.js';

export const View = Class.extend().include({
    meta(){
        this.include(Registry);
        this.include(ServiceConsumer);

        this.assignProps({
            render(context, name, params = {}){
                return context.fork().run(context => {
                    context.params = params;
                    return this.create(name, context).render();
                });
            },
        });

        const registry = this;

        this.FileImporter.include({
            importFile({ relativeFilePath, filePath }){
                registry.register(relativeFilePath, {
                    render(){
                        return renderFile(filePath);
                    }
                });
            }
        });
    },

    render(){
        // by default do nothing
    }
});

const renderFile = async filePath => [
    200,
    { 'content-type': mimeTypes.lookup(filePath) || 'application/octet-stream' },
    [ await promisify(readFile)(filePath) ]
];
