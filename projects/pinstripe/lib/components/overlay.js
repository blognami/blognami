
import { whenever } from "../node_wrapper.js";

whenever('pinstripe-overlay', function(){
    this.apply('pinstripe-frame');

    this.shadow.patch(`
        <div class="overlay">
            <slot>
        </div>

        <style>
            .overlay {
                position: fixed;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                z-index: 1000000;
            }
        </style>
    `)

    const { load, remove } = this;
    
    this.assignProps({
        isOverlay: true,
    
        load(url, options = {}){
            let { headers = {}, ...otherOptions } = options;
            load.call(this, url, Object.assign({
                headers: Object.assign({
                    'x-pinstripe-frame-type': 'overlay'
                }, headers)
            }, otherOptions));
        },
    
        remove(...args){
            if(window.getSelection().type == 'Range') return;
    
            let canRemove = true;
            this.descendants.filter(n => n.isForm).forEach(({ hasUnsavedChanges, data: { unsavedChangesConfirm } }) => {
                if(hasUnsavedChanges && unsavedChangesConfirm && !confirm(unsavedChangesConfirm)){
                    canRemove = false;
                }
            })
            if(!canRemove) return;
    
            remove.call(this, ...args);
    
            delete this.parent._overlayChild;
            
            if(!this.document.find('pinstripe-overlay')){
                this.document.body.unclip();
            }
        }
    })
});
