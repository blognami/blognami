
export default {
    meta(){
        this.scope = 'root';
    },

    create(){
        const out = {};
        const cookieHeader = this.params._headers?.cookie;
        if(cookieHeader){
            cookieHeader.split(/;/).forEach(cookie => {
                const matches = cookie.trim().match(/^([^=]+)=(.*)$/);
                if(matches){
                    out[matches[1]] = decodeURI(matches[2]);
                }
            });
        }
        return out;
    }
};
