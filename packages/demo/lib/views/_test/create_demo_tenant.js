
import crypto from 'crypto';
import { inflector } from '@pinstripe/utils';

export default {
    async render(){
        const title = 'My Demo Blog';
        const slug = await this.generateUniqueSubdomain(title);

        const tenant = await this.database.withoutTenantScope.tenants.insert({});

        const sessionCookie = await tenant.runInNewWorkspace(async function(){
            await this.database.hosts.insert({
                name: `${slug}.blognami.com`,
                type: 'internal',
                canonical: true
            });

            await this.database.site.update({ title });

            const user = await this.database.users.insert({
                name: 'Admin',
                email: 'admin@example.com',
                role: 'admin'
            });
            const passString = crypto.randomUUID();
            const session = await this.database.sessions.insert({
                userId: user.id,
                passString,
                lastAccessedAt: Date.now()
            });
            return `pinstripeSession=${session.id}:${passString}`;
        });

        const hostname = `${slug}.blognami.com`;

        return [200, { 'content-type': 'application/json' }, [JSON.stringify({ slug, hostname, sessionCookie })]];
    },

    async generateUniqueSubdomain(title){
        const base = inflector.dasherize(title);
        let n = 1;
        while(true){
            const candidate = n > 1 ? `${base}-${n}` : base;
            const existing = await this.database.withoutTenantScope.hosts.where({ name: `${candidate}.blognami.com` }).first();
            if(!existing) return candidate;
            n++;
        }
    }
};
