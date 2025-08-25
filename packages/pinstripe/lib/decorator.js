
import { Class } from './class.js';
import { Registry } from './registry.js';

export const Decorator = Class.extend().include({
    meta(){
        this.include(Registry);

        this.assignProps({
            decorate(component){
                const attributes = component.attributes;
                const decoratorAttributes = {};
                for(const name in attributes){
                    const matches = name.match(/^p-(([^:]+).*)$/);
                    if(!matches) continue;
                    console.log('name', name);
                    console.log('matches', matches);
                    decoratorAttributes[matches[2]] ??= {};
                    decoratorAttributes[matches[2]][matches[1]] = attributes[name];
                }
                for(const decoratorName of Object.keys(decoratorAttributes)){
                   this.create(decoratorName, component, decoratorAttributes[decoratorName]).decorate();
                }
            }
        })
    },

    initialize(component, attributes){
        this.component = component;
        this.attributes = attributes;
    },

    decorate(){
        
    }
});
