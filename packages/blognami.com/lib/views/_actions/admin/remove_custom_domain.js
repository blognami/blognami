
export default {
    async render(){
        const tenant = await this.database.tenant;
        if(!tenant) return [404, { 'content-type': 'text/plain' }, ['Not found']];

        const customDomain = await this.database.hosts.where({ type: 'verified' }).first();
        if(!customDomain){
            return this.renderRedirect({ target: '_parent' });
        }

        return this.renderForm(this.createModel({}), {
            title: 'Remove Custom Domain',
            description: `Are you sure you want to remove <strong>${customDomain.name}</strong>? This cannot be undone.`,
            fields: [],
            width: 'small',
            submitTitle: 'Remove',

            success: async () => {
                if(customDomain.cloudflareCustomHostnameId){
                    const cloudflare = await this.cloudflare;
                    await cloudflare.deleteCustomHostname(customDomain.cloudflareCustomHostnameId);
                }

                await customDomain.delete();

                return this.renderRedirect({ target: '_parent' });
            }
        });
    }
};
