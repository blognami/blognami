
export default {
    meta(){
        this.include('frame');
    },

    isOverlay: true,

    load(_params = {}){
        let { _headers = {}, ...params } = _params;
        _headers = { ..._headers };
        _headers['x-pinstripe-frame-type'] = _headers['x-pinstripe-frame-type'] || 'overlay';
        params._headers = _headers;

        this.constructor.classes.frame.prototype.load.call(this, params);
    },

    remove(...args){
        this.constructor.parent.prototype.remove.call(this, ...args);
        if(!this.document.descendants.find(node => node.is('body')).children.filter((child) => child.is('.ps-overlay')).length){
            this.document.descendants.filter(node => node.is('html')).forEach(node => {
                node.removeClass('ps-has-overlay');
            })
        }
    }
};
