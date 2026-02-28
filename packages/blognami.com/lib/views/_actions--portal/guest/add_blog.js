
import crypto from 'crypto';

export default {
    async render(){
        const { plan, interval } = this.params;

        let user;

        if(await this.session){
            user = await this.session.user;
        }

        if(!user){
            let returnUrl = '/_actions/guest/add_blog';
            if(plan) returnUrl += `?plan=${encodeURIComponent(plan)}`;
            if(plan && interval) returnUrl += `&interval=${encodeURIComponent(interval)}`;

            return this.renderHtml`
                <span data-component="pinstripe-anchor" data-href="/_actions/guest/sign_in?title=${encodeURIComponent('Demo')}&returnUrl=${encodeURIComponent(returnUrl)}">
                    <script type="pinstripe">
                        this.parent.trigger('click');
                    </script>
                </span>
            `;
        }

        const model = this.createModel({
            meta(){
                this.mustNotBeBlank('title');
            }
        });

        return this.renderForm(model, {
            title: 'Demo',
            fields: [{
                label: "Your blog's name",
                name: 'title',
                placeholder: 'e.g. My cool blog',
            }],
            width: 'small',
            submitTitle: 'Next',
            success: this.addPublication.bind(this)
        });
    },

    async addPublication({ title }){
        const { plan, interval } = this.params;
        const user = await this.session.user;

        const existingCount = await this.database.withoutTenantScope
            .users.where({ email: user.email }).count();

        if(existingCount >= 3){
            return this.renderHtml`
                <pinstripe-modal>
                    ${this.renderView('_panel', {
                        title: 'Blog Limit Reached',
                        body: this.renderHtml`<p>You have reached the maximum of 3 blogs per account.</p>`,
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

        return await this.database.transaction(async () => {
            const tenantName = crypto.randomUUID();
            const tenant = await this.database.tenants.insert({});

            const userName = user.name;
            const userEmail = user.email;

            await tenant.runInNewWorkspace(async function(){
                await this.database.hosts.insert({
                    name: `${tenantName}.blognami.com`,
                    type: 'internal',
                    canonical: true
                });

                await this.database.site.update({ title });

                await this.database.users.insert({
                    name: userName,
                    email: userEmail,
                    role: 'admin',
                });
            });

            if(plan && interval){
                const tenantOrigin = `https://${tenantName}.blognami.com`;
                const session = await this.session;

                const returnUrl = `${tenantOrigin}/`;

                const holdingPageUrl = new URL('/_actions/admin/saas_subscription_holding_page', tenantOrigin);
                holdingPageUrl.searchParams.set('plan', plan);
                holdingPageUrl.searchParams.set('interval', interval);
                holdingPageUrl.searchParams.set('returnUrl', returnUrl);

                const transferUrl = new URL('/_actions/guest/transfer_session', tenantOrigin);
                transferUrl.searchParams.set('id', session.id);
                transferUrl.searchParams.set('passString', session.passString);
                transferUrl.searchParams.set('returnUrl', holdingPageUrl.toString());

                const paymentUrl = await tenant.createSubscribeUrl(user, {
                    plan,
                    interval,
                    returnUrl: transferUrl.toString()
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
                    ${this.renderView('_gtag', { event: 'demo_created', tenant_id: tenant.id, subscription_tier: 'demo' })}
                    <script>
                        window.location = ${this.renderHtml(JSON.stringify(paymentUrl))};
                    </script>
                `;
            }

            return this.renderHtml`
                ${this.renderView('_gtag', { event: 'demo_created', tenant_id: tenant.id, subscription_tier: 'demo' })}
                <script>
                    window.location = ${this.renderHtml(JSON.stringify(`/_actions/user/go_to_blog?id=${tenant.id}`))};
                </script>
            `;
        });
    }
};
