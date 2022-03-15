
export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        this.on('click', '.bn-burger', () => {
            if(this.is('.bn-is-open')){
                this.removeClass('bn-is-open');
            } else {
                this.addClass('bn-is-open');
            }
        });
    }
};
