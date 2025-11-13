
import { Component } from "../component.js";
import { loadFrame, getFrame, normalizeUrl } from "./helpers.js";

Component.register('pinstripe-form', {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        const { confirm, target = '_self', method = 'GET', action, placeholder, disabled, requiresProofOfWork } = this.params;
        const frame = target == '_overlay' ? this.frame : getFrame.call(this, target);

        this.on('submit', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if(disabled !== undefined) return;           
            
            this.patch({
                ...this.attributes,
                [this.params.component ? 'data-loading' : 'loading']: 'true'
            });

            delete frame._previousHash;
            this._watchInterval?.destroy();
            
            loadFrame.call(this, { confirm, target, method, url: action, placeholderUrl: placeholder, requiresProofOfWork: requiresProofOfWork == 'true' });
        });

        if(this.isFromPlaceholderHtml) return;

        this._initialHash = JSON.stringify(this.values);
        
        if(placeholder != undefined) this.document.preload(normalizeUrl(placeholder, frame.url));
        
        const hasValuesToWatch = Object.keys(valuesToWatch.call(this)).length > 0;
        if(!hasValuesToWatch) return;
        
        frame._previousHash ||= JSON.stringify(valuesToWatch.call(this));

        this._watchInterval = this.setInterval(() => {
            const currentHash = JSON.stringify(valuesToWatch.call(this));
            if(frame._previousHash == currentHash) return;
            frame._previousHash = currentHash;
            loadFrame.call(this, { target, method: 'PATCH', url: action });
        }, 100);
    },

    isForm: true,
        
    get hasUnsavedChanges(){
        return this.params.hasUnsavedChanges == 'true' || JSON.stringify(this.values) != this._initialHash;
    }
});

function valuesToWatch(){
    const out = {}
    this.inputs.forEach(input => {
        if(input.params.watch != 'true') return;
        const value = input.value;
        if(value !== undefined){
            out[input.name] = value
        }
    })
    return out;
}