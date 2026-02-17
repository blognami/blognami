export default {
    async render(){
        const { plan, interval } = this.params;

        if(await this.isSignedOut){
            return this.renderRedirect({
                url: `/_actions/guest/sign_in?returnUrl=${encodeURIComponent('/_actions/admin/saas_manage_subscription')}`
            });
        }

        const user = await this.session.user;
        const tenant = await this.database.tenant;

        if(!tenant){
            return this.renderRedirect({ target: '_top' });
        }

        const tenantId = tenant.id;
        const userEmail = user.email;
        const userName = user.name;

        await this.runInNewPortalWorkspace(async function(){
            let portalUser = await this.database.users.where({ email: userEmail }).first();
            if(!portalUser){
                portalUser = await this.database.users.insert({
                    name: userName,
                    email: userEmail,
                    role: 'user'
                });
            }
            const portalTenant = await this.database.tenants.where({ id: tenantId }).first();
            await portalTenant.updateSubscriptionPlan(portalUser, { plan, interval });
        });

        return this.renderRedirect({ target: '_parent' });
    }
};
