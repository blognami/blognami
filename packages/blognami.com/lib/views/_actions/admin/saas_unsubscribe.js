
export default {
    async render(){
        if(await this.isSignedOut){
            return this.renderRedirect({
                url: `/_actions/guest/sign_in?returnUrl=${encodeURIComponent('/_actions/admin/saas_unsubscribe')}`
            });
        }

        const user = await this.session.user;
        const tenant = await this.database.tenant;

        if(!tenant){
            return this.renderRedirect({ target: '_top' });
        }

        const portalDatabase = await this.portalDatabase;
        const portalUser = await user.portalUser;
        const portalTenant = await portalDatabase.tenants.where({ id: tenant.id }).first();

        await portalTenant.unsubscribe(portalUser);

        return this.renderRedirect({ target: '_top' });
    }
};
