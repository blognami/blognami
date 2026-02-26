
import { Row } from '@pinstripe/database';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default {
    meta(){
        this.schedule('* * * * 5'); // run every 5 minutes

        this.whereTenant({ hosts: { name: 'blognami.com' } });
    },

    async run(){
        const { retentionDays } = Row.for('tenant').prototype;
        const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

        const tenants = await this.database.tenants.where({
            subscriptionTierNe: 'paid',
            subscriptionExpiresAtLt: cutoff
        }).all();

        for(const tenant of tenants){
            const canonicalHost = await this.database.hosts.where({
                tenantId: tenant.id,
                type: 'internal',
                canonical: true
            }).first();

            if(!canonicalHost) continue;

            const subdomain = canonicalHost.name.replace(/\.blognami\.com$/, '');
            if(UUID_REGEX.test(subdomain)) continue;

            const uuidHost = await this.database.hosts.where({
                tenantId: tenant.id,
                type: 'redirect'
            }).first();

            if(uuidHost){
                await uuidHost.update({ type: 'internal', canonical: true });
            }

            await canonicalHost.delete();
        }
    }
};
