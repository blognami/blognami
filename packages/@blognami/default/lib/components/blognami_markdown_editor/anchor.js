
export default {
    meta(){
        this.include('pinstripe-anchor');
    },

    initialize(...args){
        this.constructor.for('pinstripe-anchor').prototype.initialize.call(this, ...args);

        this.patch({ 
            ...this.attributes,
            'data-target': '_overlay',
            'data-href': '/markdown_editor'
        });
    }
};