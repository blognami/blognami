
import { promisify } from 'util'; // blognami-if(client): const promisify = undefined;
import { readFile } from 'fs'; // blognami-if(client): const readFile = undefined;
import { default as mimeTypes } from 'mime-types'; // blognami-if(client): const mimeTypes = undefined;
import * as crypto from 'crypto'; // blognami-if(client): const crypto = undefined;
import { fileURLToPath } from 'url'; // blognami-if(client): const fileURLToPath = undefined;

import { Class } from './class.js';
import { Bundle } from './bundle.js'; // blognami-if(client): const Bundle = undefined;
import { AbstractImportableRegistry } from 'haberdash';
import { ServiceFactory } from './service_factory.js';
import { Annotatable } from 'haberdash';
import { Hookable } from 'haberdash';
import { inflector } from '@blognami/utils';

// Internal: a response carrying it names a stored file, URI-encoded, for the Cloudflare Worker to answer with.
export const STATIC_ASSET_HEADER = 'x-blognami-static-asset';

export const View = Class.extend('View').include({
    meta(){
        this.include(AbstractImportableRegistry);
        this.include(ServiceFactory.Consumerable);
        this.include(Annotatable);
        this.include(Hookable);

        const { register } = this;

        this.assignProps({
            register(name, ...args){
                for(const part of name.split(/\/+/)){
                    const matches = part.match(/^.*?--(.*)$/);
                    if(!matches) continue;
                    for(const featureFlag of matches[1].split('--')){
                        register.call(this, name, {
                            meta(){
                                this.featureFor(featureFlag);
                            }
                        });
                    }
                }
                return register.call(this, name, ...args);
            },

            run(context, name, fn){
                return context.fork().run(async context => {
                    context.view = await this.create(name, context);
                    return fn.call(context.view);
                });
            },

            render(context, name, params = {}){
                return this.run(context, name, function(){
                    this.context.params = params;
                    return this.render();
                });
            },

            get featuresIsEnabledFor(){
                if(!this.hasOwnProperty('_featuresIsEnabledFor')){
                    this._featuresIsEnabledFor = [];
                }
                return this._featuresIsEnabledFor;
            },

            featureFor(name){
                const normalizedName = inflector.camelize(name);
                if(this.featuresIsEnabledFor.includes(normalizedName)) return;
                this.featuresIsEnabledFor.push(normalizedName);
            },

            addToClient(){
                this._addToClient = true;
            }
        });

        const registry = this;

        this.FileImporter.include({
            importFile(){
                const { relativeFilePath, filePath } = this;

                registry.register(relativeFilePath, {
                    meta(){
                        this.filePaths.push(filePath);
                        this.isFileBacked = true;
                    },

                    render(){
                        return renderFile(filePath);
                    }
                });

                // The server service worker has no file to read, so the view there names the stored file for the Cloudflare Worker to answer with.
                Bundle.addModule('serviceWorker', `
                    import { View, STATIC_ASSET_HEADER } from ${JSON.stringify(fileURLToPath(`${import.meta.url}/../index.js`))};
                    View.register(${JSON.stringify(relativeFilePath)}, {
                        render(){
                            return [200, { 'content-type': ${JSON.stringify(contentTypeFor(filePath))}, [STATIC_ASSET_HEADER]: ${JSON.stringify(encodeURI(relativeFilePath))} }, []];
                        }
                    });
                `);
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

    get isRoot(){
        if(!this._isRoot){
            const contexts = [];
            let context = this.context;
            while(context){
                contexts.push(context);
                context = context.parent;
            }
            const views = contexts.map(context => context.view).filter(Boolean);
            this._isRoot = views.length == 1;
        }
        return this._isRoot;
    },
    
    render(){
        // by default do nothing
    }
});

const contentTypeFor = filePath => mimeTypes.lookup(filePath) || 'application/octet-stream';

const renderFile = async filePath => [
    200,
    { 'content-type': contentTypeFor(filePath) },
    [ await promisify(readFile)(filePath) ]
];

export function createHash(data){
    return crypto.createHash('sha1').update(data).digest('base64').replace(/[^a-z0-9]/ig, '').replace(/^(.{10}).*$/, '$1');
}

