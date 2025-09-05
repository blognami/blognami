
export default {
    create(){
        if(!this.context.root.hasOwnProperty('params')){
            this.context.root.params = {
                _method: 'GET',
                _url: new URL('http://127.0.0.1/'),
                _headers: {}
            };
        }
        return this.context.root.params;
    }
};
