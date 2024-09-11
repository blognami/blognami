

export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);
        this.document.progressBar.start();
        this.loading = true;
        const interval = this.setInterval(() => {
            if(!this.loading) return;
            if(this.frame.loading) return;
            clearInterval(interval);
            (new Function(this.text)).call(this);
            this.loading = false;
            this.document.progressBar.stop();
        });
    },

    remove(...args){
        if(this.loading){
            this.loading = false;
            this.document.progressBar.stop();
        }
        this.constructor.parent.prototype.remove.call(this, ...args);
    }
};
