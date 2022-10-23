
export default {

    meta(){
        const { render } = this.prototype;

        this.include({
            async render(){
                if(render){
                    const out = await render.call(this);
                    if(out) return out;
                }
                const { _headers, _url } = this.params;
                const app = _headers['x-app'];
                if(!app || _url.pathname.match(/^\/(assets|apps)\//)) return;
                _url.pathname = `/apps/${app}${_url.pathname}`;
                return this.fetch(this.params);
            }
        })
    }
};
