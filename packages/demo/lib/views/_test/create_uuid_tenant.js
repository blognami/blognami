
import crypto from 'crypto';

export default {
    async render(){
        const uuid = crypto.randomUUID();
        const tenant = await this.database.withoutTenantScope.tenants.insert({
            subscriptionTier: 'demo',
            subscriptionExpiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        });

        const sessionCookie = await tenant.runInNewWorkspace(async function(){
            await this.database.hosts.insert({
                name: `${uuid}.blognami.com`,
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

        return [200, { 'content-type': 'application/json' }, [JSON.stringify({ uuid, sessionCookie })]];
    }
};
