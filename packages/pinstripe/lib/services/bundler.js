import { Bundle } from '../bundle.js';

export default {
    create(){
        return this.defer(() => this);
    },
    
    build(name = 'window', options = {}){
        return Bundle.create(name).build(options);
    }
};
