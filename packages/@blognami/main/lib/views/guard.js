
export default {
    async render(){
        if(this.params._url.pathname == '/up') return;
        if(!await this.database.site) return [404, {'content-type': 'text/plain'}, ['Not found']];
    }
};
