
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default {
    async render(){
        const tenant = await this.database.tenant;
        const tenantId = tenant?.id;
        const validateSubdomain = this.validateSubdomain;
        const database = this.database;

        const model = this.createModel({
            meta(){
                this.mustNotBeBlank('slug');

                this.addHook('validation', async function(){
                    if(this.isValidationError('slug')) return;

                    const slug = `${this.slug || ''}`.trim();

                    const errors = validateSubdomain(slug);
                    if(errors.length > 0){
                        this.setValidationError('slug', errors[0]);
                        return;
                    }

                    const canonicalHost = await database.hosts.where({ canonical: true }).first();
                    const subdomain = (canonicalHost?.name || '').replace(/\.blognami\.com$/, '');
                    if(!tenant || !UUID_REGEX.test(subdomain)){
                        this.setValidationError('slug', 'You have already claimed a subdomain.');
                        return;
                    }

                    const { subscriptionTier } = tenant;
                    if(subscriptionTier !== 'demo' && !tenant.isActive){
                        this.setValidationError('slug', 'An active subscription is required to claim a subdomain.');
                        return;
                    }

                    const newHost = `${slug}.blognami.com`;
                    const existingByHost = await database.withoutTenantScope.hosts.where({ name: newHost }).first();
                    if(existingByHost){
                        this.setValidationError('slug', 'This subdomain is already taken.');
                        return;
                    }
                });
            }
        });

        return this.renderForm(model, {
            title: 'Claim Your Site',
            fields: [{
                label: 'Subdomain',
                name: 'slug',
                placeholder: 'my-awesome-blog',
            }],
            width: 'small',
            submitTitle: 'Claim',

            success: async ({ slug }) => {
                const newHost = `${slug}.blognami.com`;

                await this.runInNewPortalWorkspace(async function(){
                    const oldTenantHost = await this.database.withoutTenantScope.hosts.where({ tenantId, type: 'internal', canonical: true }).first();
                    if(oldTenantHost){
                        await oldTenantHost.update({ type: 'redirect', canonical: false });
                    }

                    await this.database.withoutTenantScope.hosts.insert({
                        tenantId,
                        name: newHost,
                        type: 'internal',
                        canonical: true
                    });
                });

                const newUrl = `${this.params._url.protocol}//${newHost}`;

                return this.renderHtml`
                    ${this.renderView('_gtag', { event: 'claim_completed', tenant_id: tenantId, subscription_tier: 'demo' })}
                    <script>
                        window.location.href = ${this.renderHtml(JSON.stringify(newUrl))};
                    </script>
                `;
            }
        });
    }
};
