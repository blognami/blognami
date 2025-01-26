
export  default {
    async render(){
        const { _url } = this.params;

        _url.pathname = _url.pathname.replace(/^\/_apps\/main/, '');

        if (_url.pathname.match(/^\/_apps\//)) return this.renderView('_404');

        return this.callHandler.handleCall(this.params);
    }
};
