
export default {
    create(){
        if(!this.context.root.hasOwnProperty('cookies')){
            const cookies = {};
            const cookieHeader = this.initialParams._headers?.cookie;
            if(cookieHeader){
                cookieHeader.split(/;/).forEach(cookie => {
                    const matches = cookie.trim().match(/^([^=]+)=(.*)$/);
                    if(matches){
                        cookies[matches[1]] = decodeURI(matches[2]);
                    }
                });
            }
            this.context.root.cookies = cookies;
        }
        return this.context.root.cookies;
    }
};
