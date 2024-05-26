
export default {
    async render(){
        let user;
        if(await this.session){
            user = await this.session.user;
        }

        if(user.id == this.params.id) return this.renderView('_403', {
            message: this.renderHtml`
                You can't delete your own account - another admin must do this for you.
            `
        });

        await this.database.users.where({ id: this.params.id }).delete();
        
        return this.renderHtml`
            <span data-component="pinstripe-anchor" data-target="_top"><script type="pinstripe">this.parent.trigger('click');</script></span>
        `;
    }
};
