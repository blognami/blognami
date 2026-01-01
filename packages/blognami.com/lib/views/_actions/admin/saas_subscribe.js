
export default {
    async render(){
        const { tenantId } = this.params;

        if(await this.isSignedOut){
            return this.renderRedirect({
                url: `/_actions/guest/sign_in?returnUrl=${encodeURIComponent(`/_actions/admin/saas_subscribe?tenantId=${tenantId}`)}`
            });
        }

        const user = await this.session.user;
        const tenant = await this.database.withoutTenantScope.tenants
            .where({ id: tenantId }).first();

        if(!tenant){
            return this.renderHtml`
                <pinstripe-modal>
                    ${this.renderView('_panel', {
                        title: 'Error',
                        body: this.renderHtml`<p>Blog not found.</p>`,
                        footer: this.renderView('_button', {
                            body: this.renderHtml`
                                OK
                                <script type="pinstripe">
                                    this.parent.on('click', () => this.trigger('close'));
                                </script>
                            `
                        })
                    })}
                </pinstripe-modal>
            `;
        }

        const returnUrl = new URL('/', this.params._url);
        returnUrl.host = tenant.host;

        const portalDatabase = await this.portalDatabase;
        const portalUser = await user.portalUser;
        const portalTenant = await portalDatabase.tenants.where({ id: tenantId }).first();
        const paymentUrl = await portalTenant.createSubscribeUrl(portalUser, {
            interval: 'monthly',
            returnUrl: returnUrl.toString()
        });

        if(!paymentUrl){
            return this.renderHtml`
                <pinstripe-modal>
                    ${this.renderView('_panel', {
                        title: 'Error',
                        body: this.renderHtml`<p>Payment is not configured. Please contact support.</p>`,
                        footer: this.renderView('_button', {
                            body: this.renderHtml`
                                OK
                                <script type="pinstripe">
                                    this.parent.on('click', () => this.trigger('close'));
                                </script>
                            `
                        })
                    })}
                </pinstripe-modal>
            `;
        }

        return this.renderHtml`
            <script type="pinstripe">
                window.location.href = ${this.renderHtml(JSON.stringify(paymentUrl))};
            </script>
        `;
    }
};
