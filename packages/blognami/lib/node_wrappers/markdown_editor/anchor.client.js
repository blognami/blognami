
export default {
    meta(){
        this.include('anchor');
    },

    initialize(...args){
        this.constructor.parent.classes.anchor.prototype.initialize.call(this, ...args);
        
        this.patch({ 
            ...this.attributes,
            'data-target': '_overlay',
            'data-href': '/markdown_editor'
        });
    }
};
