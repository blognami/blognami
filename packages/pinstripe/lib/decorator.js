
import { Class } from './class.js';
import { Registry } from './registry.js';

export const Decorator = Class.extend().include({
    meta(){
        this.include(Registry);

        this.assignProps({
            decorate(component){
                const attributes = component.attributes;
                const decoratorNames = new Set();
                for(const name in attributes){
                    const matches = name.match(/^p-([^:])/);
                    if(!matches) continue;
                    const decoratorName = matches[1];
                    decoratorNames.add(decoratorName);
                }
                for(const decoratorName of decoratorNames){
                   this.create(decoratorName, component).decorate();
                }
            }
        })
    },

    initialize(component){
        this.component = component;
    },

    decorate(){
        
    }
});
