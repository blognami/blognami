
export default {
    create(){
        if(!this.context.hasOwnProperty('params')){
            this.context.params = {
                _method: 'GET',
                _url: new URL('http://localhost/'),
                _headers: {}
            };
        }
        return this.context.params;
    }
};
