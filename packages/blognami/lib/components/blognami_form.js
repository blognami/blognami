
import { loadFrame, getFrame, normalizeUrl } from "./helpers.js";

export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        const { confirm, target = '_self', method = 'GET', action, placeholder, requiresProofOfWork, disabled } = this.params;
        
        this.on('submit', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if(disabled !== undefined) return;           
            
            this.patch({
                ...this.attributes,
                [this.params.component ? 'data-loading' : 'loading']: 'true'
            });
            
            loadFrame.call(this, confirm, target, method, action, placeholder, requiresProofOfWork == 'true');
        });
    
        this._initialHash = JSON.stringify(this.values);

        const frame = target == '_overlay' ? this.frame : getFrame.call(this, target);
        if(placeholder != undefined) this.document.preload(normalizeUrl(placeholder, frame.url));
    },

    isForm: true,
        
    get hasUnsavedChanges(){
        return this.params.hasUnsavedChanges == 'true' || JSON.stringify(this.values) != this._initialHash;
    }
};
