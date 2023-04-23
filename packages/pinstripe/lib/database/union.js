
import { Class } from '../class.js';
import { inflector } from '../inflector.js';
import { Row } from './row.js';

export const Union = Class.extend().include({
    meta(){
        this.assignProps({
            tableNamesFor(name){
                const rowName = inflector.singularize(name);
                return Row.for(rowName).includedIn.filter(name => !Row.for(name).abstract).map(name => Row.for(name).collectionName);
            },

            create(name, database){
                return this.new(database, this.tableNamesFor(name).map(tableName => this.Table.create(tableName, database)));
            }
        });
    },

    initialize(database, tables){
        this.database = database;
        this.tables = tables;
        this.orderedBy = [];
    },

    where(scopedBy = {}){
        this.tables.forEach(table => table.where(scopedBy));
        return this;
    },

    orderBy(...args){
        this.orderedBy.push(args);
        return this;
    },

    paginate(page = 1, pageSize = 10, skipCount = 0){
        this.page = page;
        this.pageSize = pageSize;
        this.skipCount = skipCount;
        return this;
    },

    all(){
        return this.database.run(this.toSql());
    },

    async count(){
        return Object.values(
            (await this.database.run(this.toSql({ select: 'count(*)'}))).pop()
        ).pop();
    },

    async first(){
        return (await this.paginate(1, 1).all()).shift();
    },

    toSql(options = {}){
        const { select = '*' } = options;
        const columnNames = [];
        this.tables.forEach(table => {
            Object.keys(table.constructor.columns).forEach(columnName => {
                if(!columnNames.includes(columnName)) columnNames.push(columnName);
            });
        });

        const out = ['select ', select];

        this.database.client.adapt(this, {
            mysql(){
                out.push(' from ((');
                if(this.tables.length == 0) out.push('select null limit 0');

                this.tables.forEach((table, i) => {
                    if(i > 0) out.push(') union all (');
                    out.push(table.toSql({ columnNames }));
                });
                out.push(')) as \`_union\`');
            },

            sqlite(){
                out.push(' from (');
                if(this.tables.length == 0) out.push('select null limit 0');

                this.tables.forEach((table, i) => {
                    if(i > 0) out.push(' union all ');
                    out.push(table.toSql({ columnNames }));
                });
                out.push(')');
            }
        });

        if(typeof this.pageSize == 'number'){
            out.push(' limit ?', this.pageSize);
        }

        let offset = 0;

        if(typeof this.page == 'number' && typeof this.pageSize == 'number'){
            offset = (this.page - 1) * this.pageSize;
        }

        if(typeof this.skipCount == 'number'){
            offset = offset + this.skipCount;
        }

        if(offset > 0){
            out.push(' offset ?', offset);
        }

        return out;
    },

    async update(fields = {}){
        const rows = await this.all();
        while(rows.length){
            await rows.shift().update(fields);
        }
        return this;
    },

    async delete(){
        const rows = await this.all();
        while(rows.length){
            await rows.shift().delete();
        }
        return this;
    }
});
