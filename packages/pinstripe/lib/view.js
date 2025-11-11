
import { promisify } from 'util'; // pinstripe-if-client: const promisify = undefined;
import { readFile } from 'fs'; // pinstripe-if-client: const readFile = undefined;
import { default as mimeTypes } from 'mime-types'; // pinstripe-if-client: const mimeTypes = undefined;
import * as crypto from 'crypto'; // pinstripe-if-client: const crypto = undefined;

import { Class } from './class.js';
import { ImportableRegistry } from './importable_registry.js';
import { ServiceConsumer } from './service_consumer.js';
import { Annotatable } from './annotatable.js';
import { Hookable } from './hookable.js';
import { inflector } from '@pinstripe/utils';

export const View = Class.extend().include({
    meta(){
        this.assignProps({ name: 'View' });

        this.include(ImportableRegistry);
        this.include(ServiceConsumer);
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
                    return fn.call(context.view, context.view);
                });
            },

            render(context, name, params = {}){
                return this.run(context, name, view => {
                    view.context.params = params;
                    return view.render();
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

const renderFile = async filePath => [
    200,
    { 'content-type': mimeTypes.lookup(filePath) || 'application/octet-stream' },
    [ await promisify(readFile)(filePath) ]
];

export function createHash(data){
    return crypto.createHash('sha1').update(data).digest('base64').replace(/[^a-z0-9]/ig, '').replace(/^(.{10}).*$/, '$1');
}

