
import { Row } from './row.js';

Row.register('untenantable', {
    meta(){
        this.assignProps({
            untenantable: true
        });

        this.includeInTable({
            meta(){
                this.assignProps({
                    untenantable: true
                });
            }
        })
    }
});

for (const name of ['appliedMigration', 'columnType']){
    Row.register(name, {
        meta(){
            this.include('untenantable');
        }
    });
}
