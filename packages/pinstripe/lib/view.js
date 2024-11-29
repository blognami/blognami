
import { promisify } from 'util'; // pinstripe-if-client: const promisify = undefined;
import { readFile } from 'fs'; // pinstripe-if-client: const readFile = undefined;
import { default as mimeTypes } from 'mime-types'; // pinstripe-if-client: const mimeTypes = undefined;
import * as crypto from 'crypto'; // pinstripe-if-client: const crypto = undefined;

import { Class } from './class.js';
import { Registry } from './registry.js';
import { ServiceConsumer } from './service_consumer.js';

export const View = Class.extend().include({
    meta(){
        this.assignProps({ name: 'View' });

        this.include(Registry);
        this.include(ServiceConsumer);
        
        this.assignProps({
            run(context, name, fn){
                return context.fork().run(async context => {
                    context.view = await this.create(name, context);
                    return fn.call(context.view, context.view);
                });
            },

            render(context, name, params = {}){
                return this.run(context, name, view => {
                    view.context.params = params;
                    return view.render();
                });
            }
        });

        const registry = this;

        this.FileImporter.include({
            importFile({ relativeFilePath, filePath }){
                registry.register(relativeFilePath, {
                    meta(){
                        this.filePaths.push(filePath);
                    },

                    render(){
                        return renderFile(filePath);
                    }
                });
            }
        });
    },

    get hash(){
        if(!this._hash){
            this._hash = createHash(this.constructor.name);
        }
        return this._hash;
    },

    get cssClasses(){
        if(!this._cssClasses){
            this._cssClasses = this.cssClassesFor(this.constructor.name);
        }
        return this._cssClasses;
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

export function createHash(data){
    return crypto.createHash('sha1').update(data).digest('base64').replace(/[^a-z0-9]/ig, '').replace(/^(.{10}).*$/, '$1');
}

