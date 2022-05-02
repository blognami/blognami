
import { Table } from '../../../database/table.js';

Table.include({
    meta(){
        const { create } = this.prototype;

        this.include({
            async create(...args){
                const out = await create.call(this, ...args);
                if(this.constructor.name.match(/^pinstripe[A-Z]/)) return out;
                if(this.constructor.name == 'tenants') return out;
                await this.addColumn('tenantId', 'foreign_key');
                return out;
            }
        });
    }
});
