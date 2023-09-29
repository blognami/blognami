

export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);
        
        if(this.params.type != 'pinstripe') return;

        this.setTimeout(() => (new Function(this.text)).call(this));
    }
};
