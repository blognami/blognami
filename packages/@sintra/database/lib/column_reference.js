
import { Class } from '@sintra/utils';

export const ColumnReference = Class.extend().include({
    initialize(tableReference, name){
        this.tableReference = tableReference;
        this.name = name;
    },

    toSql(){
        return `${this.tableReference.toSql()}.\`${this.name}\``;
    }
});
