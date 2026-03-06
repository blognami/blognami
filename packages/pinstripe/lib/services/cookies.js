
export default {
    create(){
        return this.context.root.getOrCreate('cookies', () => {
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
            return cookies;
        });
    }
};
