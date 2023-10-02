
export default {
    async render(){
        if(!await this.database.site) return [404, {'content-type': 'text/plain'}, ['Not found']];
    }
};
