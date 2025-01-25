export default {

    meta(){
        const { render } = this.prototype;

        this.include({
            async render(){
                const { _headers, _url } = this.params;
                const app = await this.app;
                if(render && _headers['x-rerouted'] && app == 'main') return render.call(this);
                if(_headers['x-rerouted']) return;
                _headers['x-rerouted'] = 'true';
                _url.pathname = `/_apps/${app}${_url.pathname}`;
                return this.callHandler.handleCall(this.params);
            }
        })
    }
};
