
export default {
    async run(){
        if(process.env.TENANCY === 'multi'){
            const lorumIpsumTenant = await this.database.tenants.insert({});

            await lorumIpsumTenant.runInNewWorkspace(async function(){
                await this.database.hosts.insert({
                    name: 'lorum-ipsum.blognami.com',
                    type: 'internal',
                    canonical: true
                });
            });

            if(process.env.SKIP_FIXTURES == 'true') return;

            await lorumIpsumTenant.runInNewWorkspace(async function(){
                await this.loadLorumIpsum();
            });
        } else {
            if(process.env.SKIP_FIXTURES == 'true') return;

            await this.loadLorumIpsum();
        }
    }
};
