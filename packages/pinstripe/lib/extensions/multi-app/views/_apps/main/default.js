

const allow = /.*/;
const deny = /^\/_apps\//;

export  default {
    async render(){
        const { _url } = this.params;

        _url.pathname = _url.pathname.replace(/^\/_apps\/main/, '');

        if (_url.pathname.match(/^\/_apps\//)) {
            return await this.renderView('_404') || [404, {'content-type': 'text/plain'}, ['Not found']];
        }

        return this.callHandler.handleCall(this.params);
    }
};
