
import { Widget } from 'pinstripe';

Widget.register('input').include({
    meta(){
        this.assignProps({ selector: 'input, textarea, .p-input' });
    },

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
