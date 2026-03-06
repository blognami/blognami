
import crypto from 'crypto';
import { inflector } from '@pinstripe/utils';

let counter = 0;

export default {
    async render(){
        counter++;
        const title = `Test Blog ${counter}`;
        const slug = await this.generateUniqueSubdomain(title);

        const tenant = await this.database.withoutTenantScope.tenants.insert({
            subscriptionTier: 'demo',
            subscriptionExpiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        });

        const sessionCookie = await tenant.runInNewWorkspace(async function(){
            await this.database.hosts.insert({
                name: `${slug}.blognami.com`,
                type: 'internal',
                canonical: true
            });

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

        return [200, { 'content-type': 'application/json' }, [JSON.stringify({ slug, sessionCookie })]];
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
