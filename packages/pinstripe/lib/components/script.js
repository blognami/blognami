

export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);
        
        if(this.attributes.type != 'pinstripe') return;

        this.setTimeout(() => (new Function(this.text)).call(this));
    }
};
