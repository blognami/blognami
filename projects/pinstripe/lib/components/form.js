
import { defineComponent } from "../node_wrapper.js";
import { loadFrame } from "./helpers.js";

defineComponent('pinstripe-form', function(){
    const { confirm, target = '_self', method = 'GET', action } = { ...this.attributes, ...this.data };
    
    this.on('submit', (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        loadFrame.call(this, confirm, target, method, action);
    });

    this._initialHash = JSON.stringify(this.values);
    
    this.assignProps({    
        isForm: true,
    
        get hasUnsavedChanges(){
            return this.data.hasUnsavedChanges || JSON.stringify(this.values) != this._initialHash;
        }
    });
});

defineComponent('form', function(){
    this.apply('pinstripe-form');
});
