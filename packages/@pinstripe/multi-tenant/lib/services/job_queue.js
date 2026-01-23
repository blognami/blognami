
export default {
    meta(){
        const { push } = this.prototype;
        this.include({
            async push(name, params = {}){
                const tenant = await this.database.tenant;
                if(tenant){
                    params = {
                        ...params,
                        _headers: { 'x-tenant-id': tenant.id, ...(params._headers || {}) }
                    };
                }
                return push.call(this, name, params);
            }
        });
    }
};
