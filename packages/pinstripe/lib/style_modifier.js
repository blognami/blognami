
import { Class } from './class.js';
import { Registry } from './registry.js';

// Perhaps StyleScope or StyleCondition would be a better name?
export const StyleModifier = Class.extend().include({
    meta(){
        this.include(Registry);
    },

    initialize(styles){
        this.styles = styles;
    },

    apply(){

    }
});

