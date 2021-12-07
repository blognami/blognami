
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

    load(_params = {}){
        let { _headers = {}, ...params } = _params;
        _headers = { ..._headers };
        _headers['x-pinstripe-frame-type'] = _headers['x-pinstripe-frame-type'] || 'overlay';
        params._headers = _headers;

        this.constructor.classes.frame.prototype.load.call(this, params);
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
