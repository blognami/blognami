
export default {
    create(){
        return async fn => this.database.withoutTenantScope.tenants.where({ name: 'portal' }).first().runInNewWorkspace(fn);
    }
};
