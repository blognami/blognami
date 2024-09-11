

export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);
        
        const interval = this.setInterval(() => {
            if(this.frame.loading) return;
            clearInterval(interval);
            (new Function(this.text)).call(this);
        });
    }
};
