
export default {
    meta(){
        this.include('a');
    },

    initialize(...args){
        this.constructor.for('a').prototype.initialize.call(this, ...args);

        this.patch({ 
            ...this.attributes,
            'data-target': '_overlay',
            'data-href': '/markdown_editor'
        });
    }
};