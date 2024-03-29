
export default {
    meta(){
        this.include('pinstripe-frame');
    },

    initialize(...args){
        this.constructor.for('pinstripe-frame').prototype.initialize.call(this, ...args);

        this.shadow.patch(`
            <style>
                .root {
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    z-index: 1000000;
                }
            </style>
            <div class="root">
                <slot>
            </div>
        `);

        this.on('close', (event) => {
            event.stopPropagation();
            this.setTimeout(() => this.remove());
        });
    },

    isOverlay: true,

    remove(...args){
        if(window.getSelection().type == 'Range') return;

        let canRemove = true;
        this.descendants.filter(n => n.isForm).forEach(({ hasUnsavedChanges, params: { unsavedChangesConfirm } }) => {
            if(hasUnsavedChanges && unsavedChangesConfirm && !confirm(unsavedChangesConfirm)){
                canRemove = false;
            }
        })
        if(!canRemove) return;

        this.constructor.parent.prototype.remove.call(this, ...args);

        delete this.parent._overlayChild;
        
        if(!this.document.find('pinstripe-overlay')){
            this.document.body.unclip();
        }
    }
};
