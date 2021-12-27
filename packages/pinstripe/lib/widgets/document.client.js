
export default {
    meta(){
        this.include('frame');

        this.parent.prototype.assignProps({
            isDocument: false,

            get document(){
                return this.parents.find(({ isDocument }) => isDocument) || this;
            }
        });
        
        this.assignProps({
            cssNamespace: undefined
        });
    },

    isDocument: true,

    hasOverlayCssClass: 'has-overlay',

    initialize(...args){
        this.constructor.classes.frame.prototype.initialize.call(this, ...args);

        window.onpopstate = (event) => {
            this.load({ _url: event.state || window.location }, true);
        };
        window._nodeWrapper = this;
    },

    get progressBar(){
        if(!this._progressBar){
            this._progressBar = this.descendants.find(node => node.is('*[data-widget="progress-bar"]'));
        }
        return this._progressBar;
    },

    load(_params = {}, replace = false){
        const previousUrl = this.url.toString();
        
        let { _headers = {}, ...params } = _params;
        _headers = { ..._headers };
        _headers['x-pinstripe-frame-type'] = _headers['x-pinstripe-frame-type'] || 'document';
        params._headers = _headers;

        this.constructor.classes.frame.prototype.load.call(this, params);
        if(params._method == 'GET' && previousUrl != this.url.toString()){
            if(replace){
                history.replaceState(this.url.toString(), null, this.url.toString());
            } else {
                history.pushState(this.url.toString(), null, this.url.toString());
                window.scrollTo(0, 0);
            }
        }
    }
};

