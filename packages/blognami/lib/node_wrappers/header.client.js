
export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        this.on('click', '.burger', () => {
            if(this.is('.is-open')){
                this.removeClass('is-open');
            } else {
                this.addClass('is-open');
            }
        });
    }
};
