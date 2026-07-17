
export default {
    meta(){
        this.addHook('signInTitle', function(){
            if(this.params._url.pathname == '/_actions/user/add_comment') return 'Add comment';
        });

        this.addHook('signInTitle', function(){
            if(this.params._url.pathname == '/_actions/user/subscribe') return 'Subscribe';
        });

        this.addHook('render', async function(){
            const actionRole = this.params._url.pathname.split('/')[2];

            if(actionRole == 'guest') return;

            const user = await this.user;
            const impliedRoles = user ? user.impliedRoles : [];

            if(impliedRoles.includes(actionRole)) return;

            if(!user){
                const returnUrl = this.params._url.pathname + this.params._url.search;
                const title = await this.runHook('signInTitle', { stopIf: result => result }).pop();
                return this.renderRedirect({
                    url: `/_actions/guest/sign_in?returnUrl=${encodeURIComponent(returnUrl)}${title ? `&title=${encodeURIComponent(title)}` : ''}`
                });
            }

            return this.renderView('_403', {
                message: this.renderHtml`
                    You need the &quot;${actionRole}&quot; role to do this.
                `
            });
        });
    },

    async render(){
        return this.runHook('render', { stopIf: result => result }).pop();
    }
};
