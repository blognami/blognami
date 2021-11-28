
export default {
    meta(){
        this.isPrivate = true;

        this.include('frame');

        this.parent.prototype.assignProps({
            isOverlay: false,

            get overlay(){
                return this.parents.find(({ isOverlay }) => isOverlay);
            }
        });
    },

    isOverlay: true,

    cssClass: 'p-overlay',

    initialize(...args){
        this.constructor.classes.frame.prototype.initialize.call(this, ...args);
        this.addClass(this.cssClass);
    },

    remove(...args){
        this.constructor.parent.prototype.remove.call(this, ...args);
        if(!this.document.descendants.find(node => node.is('body')).children.filter((child) => child.is('*[data-widget="internal/overlay"]')).length){
            this.document.descendants.filter(node => node.is('html')).forEach(node => {
                node.removeClass(this.document.hasOverlayCssClass);
            })
        }
    }
};
