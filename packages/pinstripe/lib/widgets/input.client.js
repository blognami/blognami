
import { defineWidget } from 'pinstripe';

defineWidget('input', {
    get name(){
        return this.attributes.name;
    },
    
    get value(){
        if(this.is('input[type="checkbox"], input[type="radio"]')){
            return this.is(':checked') ? this.node.value : undefined;
        }
        return this.node.value;
    }
});
