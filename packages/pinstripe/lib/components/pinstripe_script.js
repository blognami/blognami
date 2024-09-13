

export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        if(this.isFromCachedHtml) return;

        (new Function(this.text)).call(this);
    }
};
