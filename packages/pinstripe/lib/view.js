
import { promisify } from 'util'; // pinstripe-if-client: const promisify = undefined;
import { readFile } from 'fs'; // pinstripe-if-client: const readFile = undefined;
import { default as mimeTypes } from 'mime-types'; // pinstripe-if-client: const mimeTypes = undefined;

import { Class } from './class.js';
import { Registry } from './registry.js';
import { ServiceConsumer } from './service_consumer.js';

export const View = Class.extend().include({
    meta(){
        this.include(Registry);
        this.include(ServiceConsumer);
        
        this.assignProps({
            render(context, name, params = {}){
                return context.fork().run(async context => {
                    context.params = params;
                    context.view = await this.create(name, context);
                    return context.view.render();
                });
            },

            mapperFor(namespaces = []){
                const cacheKey = JSON.stringify(namespaces);
                if(!this.cache.mappers) this.cache.mappers = {};
                if(!this.cache.mappers[cacheKey]){
                    const map = {};
                    namespaces.forEach(namespace => {
                        this.names.forEach(name => {
                            const pattern = new RegExp(`^${namespace}/(.*)$`);
                            const matches = name.match(pattern);
                            if(!matches) return;
                            map[matches[1]] = name;
                        })
                    });
                    
                    this.cache.mappers[cacheKey] = Class.extend().include({
                        isView(name){
                            return !!map[name];
                        },

                        renderView(context, name, params = {}){
                            return View.render(context, map[name], params);
                        },

                        resolveView(viewName){
                            return map[viewName];
                        },

                        get viewNames(){
                            return Object.keys(map).sort();
                        }
                    }).new();
                }
                return this.cache.mappers[cacheKey];
            }
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
