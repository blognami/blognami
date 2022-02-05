
import { loadFrame } from "./helpers.js";


export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);
        
        this.on('submit', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const { confirm, target = '_self', method = 'GET', action } = { ...this.attributes, ...this.data };
            loadFrame.call(this, confirm, target, method, action);
        });
    }
};
