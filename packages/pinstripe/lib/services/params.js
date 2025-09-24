
export default {
    meta(){
        this.addToClient();
    },

    create(){
        if(!this.context.hasOwnProperty('params')){
            this.context.params = {
                _method: 'GET',
                _url: new URL('http://127.0.0.1/'),
                _headers: {}
            };
        }
        return this.context.params;
    }
};
