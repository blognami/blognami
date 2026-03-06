
export default {
    meta(){
        this.addToClient();
    },

    create(){
        return this.context.getOrCreate('params', () => ({
            _method: 'GET',
            _url: new URL('http://127.0.0.1/'),
            _headers: {}
        }));
    }
};
