
import { loadFrame } from "./helpers.js";

export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        const { confirm, target = '_self', method = 'GET', action } = this.params;
        
        this.on('submit', (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            loadFrame.call(this, confirm, target, method, action);
        });
    
        this._initialHash = JSON.stringify(this.values);
    },

    isForm: true,
        
    get hasUnsavedChanges(){
        return this.params.hasUnsavedChanges == 'true' || JSON.stringify(this.values) != this._initialHash;
    }
};
