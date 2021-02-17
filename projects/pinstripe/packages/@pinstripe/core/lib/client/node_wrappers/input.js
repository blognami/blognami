
import { NodeWrapper } from '../node_wrapper.js';

export class Input extends NodeWrapper {

    static get name(){ return 'input' }
    
    static get selector(){ return 'input, textarea, .p-input' }

    get name(){
        return this.attributes.name
    }
    
    get value(){
        if(this.is('input[type="checkbox"], input[type="radio"]')){
            return this.is(':checked') ? this.node.value : undefined
        }
        return this.node.value
    }

}

Input.register()
