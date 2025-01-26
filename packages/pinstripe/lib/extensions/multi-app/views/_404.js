export default {

    meta(){
        const { render } = this.prototype;

        this.include({
            async render(){
                if(render && await this.app == 'main') return render.call(this);
                return [404, {'content-type': 'text/plain'}, ['Not found']];
            }
        })
    }
};
