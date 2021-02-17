
import { Inflector } from './inflector.js'

export const Hookable = dsl => (dsl
    .classProps({
        ['dsl.hooks'](...names){
            names.forEach(name => {
                const camelizedName = Inflector.camelize(name);
                const callbacks = `${camelizedName}Callbacks`;
                const _callbacks = `_${callbacks}`;

                this.define(dsl => dsl
                    .classProps({
                        get [callbacks](){
                            if(!this.hasOwnProperty(_callbacks)){
                                this[_callbacks] = [];
                            }
                            return this[_callbacks];
                        },

                        [`dsl.${camelizedName}`](fn){
                            this[callbacks].push(fn);
                        }
                    })
                    .props({
                        async [`_run${Inflector.pascalize(name)}Callbacks`](){
                            for(let i = 0; i < this.constructor[callbacks].length; i++){
                                await this.constructor[callbacks][i].call(this, this);
                            }
                        }
                    })
                );
            });
        }
    })
);
