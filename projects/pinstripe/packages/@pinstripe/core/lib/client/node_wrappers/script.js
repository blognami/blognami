
import { NodeWrapper } from '../node_wrapper.js';

export class Script extends NodeWrapper {

    static get name(){ return 'script' }
    
    static get selector(){ return 'script[type="pinstripe"]' }

    constructor(...args){
        super(...args);
        new Function(this.text).call(this);
    }

}

Script.register()
