import { Bundle } from '../bundle.js';

export default {
    create(){
        return this.defer(() => this);
    },
    
    build(options = {}){
        return Bundle.create('window').build(options);
    }
};
