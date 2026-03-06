
export default {
    async render(){
        const tenant = await this.database.tenant;
        const tenantId = tenant?.id;
        const validateSubdomain = this.validateSubdomain;
        const database = this.database;

        const canonicalHost = await database.hosts.where({ canonical: true }).first();
        const currentSubdomain = (canonicalHost?.name || '').replace(/\.blognami\.com$/, '');

        const model = this.createModel({
            meta(){
                this.mustNotBeBlank('slug');

                this.addHook('validation', async function(){
                    if(this.isValidationError('slug')) return;

                    const slug = `${this.slug || ''}`.trim();

                    if(slug === currentSubdomain) return;

                    const errors = validateSubdomain(slug);
                    if(errors.length > 0){
                        this.setValidationError('slug', errors[0]);
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
        }).new({
            slug: currentSubdomain
        });

        return this.renderForm(model, {
            title: 'Edit Subdomain',
            fields: [{
                label: 'Subdomain',
                name: 'slug',
                placeholder: 'my-awesome-blog'
            }],
            width: 'small',
            submitTitle: 'Save',

            success: async ({ slug }) => {
                if(slug === currentSubdomain) return;

                const newHost = `${slug}.blognami.com`;

                await this.runInNewPortalWorkspace(async function(){
                    const oldTenantHost = await this.database.withoutTenantScope.hosts.where({ tenantId, type: 'internal', canonical: true }).first();
                    if(oldTenantHost){
                        await oldTenantHost.update({ name: newHost });
                    }
                });

                const newUrl = `${this.params._url.protocol}//${newHost}`;

                return this.renderHtml`
                    <script>
                        window.location.href = ${this.renderHtml(JSON.stringify(newUrl))};
                    </script>
                `;
            }
        });
    }
};
