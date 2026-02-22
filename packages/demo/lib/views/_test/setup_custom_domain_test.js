
import crypto from 'crypto';

export default {
    async render(){
        const { action } = this.params;

        if(action === 'create_publisher_tenant'){
            const uuid = crypto.randomUUID();
            const tenant = await this.database.withoutTenantScope.tenants.insert({
                name: uuid,
                host: `${uuid}.blognami.com`,
                subscriptionTier: 'paid',
                subscriptionPlan: 'publisher',
                subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });

            await this.database.withoutTenantScope.hosts.insert({
                tenantId: tenant.id,
                name: `${uuid}.blognami.com`,
                type: 'internal',
                canonical: true
            });

            const sessionCookie = await tenant.runInNewWorkspace(async function(){
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

            return [200, { 'content-type': 'application/json' }, [JSON.stringify({ uuid, tenantId: tenant.id, sessionCookie })]];
        }

        if(action === 'add_verified_host'){
            const { tenantId, hostname } = this.params;
            await this.database.withoutTenantScope.hosts.insert({
                tenantId,
                name: hostname,
                type: 'verified',
                canonical: false,
                cloudflareCustomHostnameId: 'test-cf-id'
            });
            return [200, { 'content-type': 'application/json' }, [JSON.stringify({ ok: true })]];
        }

        if(action === 'add_redirect_host'){
            const { tenantId, hostname } = this.params;
            await this.database.withoutTenantScope.hosts.insert({
                tenantId,
                name: hostname,
                type: 'redirect',
                canonical: false
            });
            return [200, { 'content-type': 'application/json' }, [JSON.stringify({ ok: true })]];
        }

        if(action === 'get_tenant_id'){
            const { name } = this.params;
            const tenant = await this.database.withoutTenantScope.tenants.where({ name }).first();
            return [200, { 'content-type': 'application/json' }, [JSON.stringify({ tenantId: tenant?.id })]];
        }

        if(action === 'get_tenant_hosts'){
            const { tenantId } = this.params;
            const hosts = await this.database.withoutTenantScope.hosts.where({ tenantId }).all();
            const result = [];
            for(const host of hosts){
                result.push({
                    name: host.name,
                    type: host.type,
                    canonical: host.canonical,
                    cloudflareCustomHostnameId: host.cloudflareCustomHostnameId
                });
            }
            return [200, { 'content-type': 'application/json' }, [JSON.stringify(result)]];
        }

        return [400, { 'content-type': 'application/json' }, [JSON.stringify({ error: 'Unknown action' })]];
    }
};
