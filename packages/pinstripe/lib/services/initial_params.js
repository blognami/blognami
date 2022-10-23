
export default {
    create(){
        if(!this.context.root.hasOwnProperty('params')){
            this.context.root.params = {
                _method: 'GET',
                _url: new URL('http://localhost/'),
                _headers: {}
            };
        }
        return this.context.root.params;
    }
};
