
import { AbstractImportableRegistry } from './abstract_importable_registry.js';
import { Hookable } from './hookable.js';
import { trapify } from './trapify.js';
import { inflector } from './inflector.js';
import { Class } from './class.js';
import { Context } from './context.js';

export const AbstractServiceFactory = {
    meta(){
        this.include(AbstractImportableRegistry);
        this.include(Hookable);
        const Factory = this;
        this.assignProps({
            normalizeName(name){
                return inflector.camelize(name);
            },

            get Consumerable(){
                if(!this.hasOwnProperty('_Consumerable')){
                    this._Consumerable = {
                        initialize(context){ this.context = context; return trapify(this); },
                        __getMissing(target, name){
                            const normalizedName = Factory.normalizeName(name);
                            if(Factory.mixins[normalizedName]){
                                const service = Factory.create(normalizedName, this.context).create();
                                const interceptor = this.context._serviceInterceptors?.[normalizedName];
                                return interceptor ? interceptor(service) : service;
                            }
                        }
                    };
                }
                return this._Consumerable;
            },

            get Workspace(){
                if(!this.hasOwnProperty('_Workspace')){
                    this._Workspace = Class.extend().include({
                        meta(){
                            this.include(Factory.Consumerable);

                            this.assignProps({
                                async run(fn, parentContext){
                                    const { importAll } = await import('./import_all.js'); // pinstripe-if-client: const importAll = () => {};
                                    await importAll();
                                    return await Context.new().run(async context => {
                                        if(parentContext?._serviceInterceptors){
                                            context._serviceInterceptors = { ...parentContext._serviceInterceptors };
                                        }
                                        const workspace = this.new(context);
                                        return await fn.call(workspace);
                                    });
                                }
                            });
                        }
                    });
                }
                return this._Workspace;
            }
        });
    }
};
