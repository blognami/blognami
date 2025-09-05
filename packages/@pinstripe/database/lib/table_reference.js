
import { Class } from '@pinstripe/utils';
import { ColumnReference } from './column_reference.js';

export const TableReference = Class.extend().include({
    initialize(name, alias, aliasCounters = {}){
        this.name = name;
        this.alias = alias || name;
        this.aliasCounters = aliasCounters;
    },

    clone(){
        return TableReference.new(
            this.name,
            this.alias,
            { ...this.aliasCounters }
        );
    },

    createTableReference(name){
        if(!this.aliasCounters[name]) this.aliasCounters[name] = 0;
        this.aliasCounters[name]++;
        return this.constructor.new(name, `${name}${this.aliasCounters[name] > 1 ? this.aliasCounters[name] : '' }From${this.alias[0].toUpperCase() + this.alias.slice(1)}`);
    },

    createColumnReference(name){
        return ColumnReference.new(this, name);
    },

    toSql(){
        return `\`${this.alias}\``;
    }
});
