
import { promises as dns } from 'dns';

export default {
    async render(){
        const tenant = await this.database.tenant;
        if(!tenant) return [404, { 'content-type': 'text/plain' }, ['Not found']];

        const tenantId = tenant.id;

        if(!tenant.isCustomDomainEnabled){
            return this.renderHtml`
                <pinstripe-modal>
                    ${this.renderView('_panel', {
                        title: 'Custom Domain',
                        body: this.renderHtml`<p>Custom domains are available on the Publisher plan. Upgrade your subscription to connect a custom domain.</p>`,
                        footer: this.renderView('_button', {
                            tagName: 'a',
                            body: 'Choose a plan',
                            isPrimary: true,
                            href: `/_actions/admin/saas_subscribe?tenantId=${tenantId}`,
                            target: '_overlay'
                        })
                    })}
                </pinstripe-modal>
            `;
        }

        const existingCustomDomain = await this.database.hosts.where({ type: 'verified' }).first();
        if(existingCustomDomain){
            return this.renderHtml`
                <pinstripe-modal>
                    ${this.renderView('_panel', {
                        title: 'Custom Domain',
                        body: this.renderHtml`<p>Your custom domain <strong>${existingCustomDomain.name}</strong> is connected.</p>`,
                        footer: this.renderView('_button', {
                            tagName: 'a',
                            body: 'Remove',
                            href: `/_actions/admin/remove_custom_domain`,
                            target: '_overlay'
                        })
                    })}
                </pinstripe-modal>
            `;
        }

        const database = this.database;

        const model = this.createModel({
            meta(){
                this.mustNotBeBlank('domain');

                this.addHook('validation', async function(){
                    if(this.isValidationError('domain')) return;

                    const domain = `${this.domain || ''}`.trim().toLowerCase();

                    if(!/^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/.test(domain)){
                        this.setValidationError('domain', 'Please enter a valid domain name (e.g. blog.example.com).');
                        return;
                    }

                    if(domain.endsWith('.blognami.com')){
                        this.setValidationError('domain', 'You cannot use a blognami.com subdomain as a custom domain.');
                        return;
                    }

                    let cnameTarget;
                    try {
                        const records = await dns.resolveCname(domain);
                        cnameTarget = records[0];
                    } catch(e) {
                        this.setValidationError('domain', 'Could not verify DNS. Please add a CNAME record pointing to blognami.com and try again.');
                        return;
                    }

                    if(!cnameTarget || !cnameTarget.toLowerCase().endsWith('blognami.com')){
                        this.setValidationError('domain', 'The CNAME record does not point to blognami.com. Please update your DNS settings.');
                        return;
                    }

                    const existing = await database.withoutTenantScope.hosts.where({ name: domain }).first();
                    if(existing){
                        await existing.update({ type: 'unverified' });
                    }
                });
            }
        });

        return this.renderForm(model, {
            title: 'Connect Custom Domain',
            fields: [{
                label: 'Domain',
                name: 'domain',
                placeholder: 'blog.example.com',
            }],
            width: 'small',
            submitTitle: 'Connect',

            success: async ({ domain }) => {
                domain = domain.trim().toLowerCase();

                const cloudflare = await this.cloudflare;
                const cloudflareCustomHostnameId = await cloudflare.createCustomHostname(domain);

                await this.database.hosts.insert({
                    name: domain,
                    type: 'verified',
                    canonical: false,
                    cloudflareCustomHostnameId
                });

                return this.renderRedirect({ target: '_parent' });
            }
        });
    }
};
