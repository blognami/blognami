
export default {
    create(){
        return async fn => this.database.withoutTenantScope.tenants.where({ hosts: { name: 'blognami.com' } }).first().runInNewWorkspace(fn);
    }
};
