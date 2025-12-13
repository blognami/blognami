
export default {
    create(){
        return this.defer(async () => {
            const portal = await this.database.withoutTenantScope.tenants
                .where({ name: 'portal' }).first();
            return portal.scopedDatabase;
        });
    }
};
