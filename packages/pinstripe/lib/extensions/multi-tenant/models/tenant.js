
import { Row } from "pinstripe/database";

export default {
    meta(){
        Row.names.sort().forEach(name => {
            if(name == 'tenant' || name == 'appliedMigration') return;
            const { collectionName, abstract } = Row.for(name);
            this.hasMany(collectionName, { cascadeDelete: !abstract });
        });

        this.hasMany('tenants', { cascadeDelete: false });
    }
};
