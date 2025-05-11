
import { Row, Database } from "@sintra/database";
import { defer } from '@sintra/utils';

export default {
    meta(){
        Row.names.sort().forEach(name => {
            if(name == 'tenant' || name == 'appliedMigration') return;
            const { collectionName, abstract } = Row.for(name);
            this.hasMany(collectionName, { cascadeDelete: !abstract });
        });

        this.hasMany('tenants', { cascadeDelete: false });
    },

    get scopedDatabase(){
        return defer(async () => {
            const out = await Database.new(this.database.client, this.database.context);
            out.tenant = this;
            return out;
        });
    }
};
