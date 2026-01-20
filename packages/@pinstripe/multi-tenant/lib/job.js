
import { Job } from 'pinstripe';

Job.include({
    meta(){
        this.assignProps({
            get tenantScopes(){
                if(!this.hasOwnProperty('_tenantScopes')) this._tenantScopes = [];
                return this._tenantScopes;
            },

            whereTenant(scope){
                this.tenantScopes.push(scope);
                return this;
            }
        });
    }
});
