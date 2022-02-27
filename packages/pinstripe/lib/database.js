
import { Base } from './base.js';
import { Table } from './database/table.js';
import { Union } from './database/union.js';
import { Row } from './database/row.js';
import { Migrator } from './database/migrator.js';
import { Adapter, createAdapterDeligator } from './database/adapter.js';

const deligateToAdapter = createAdapterDeligator('database');

export const Database = Base.extend().include({
    async initialize({ environment, config }){
        this._environment = environment;
        const { adapter = 'mysql', ...adapterConfig } = await config.database;
        this._adapter = Adapter.create(adapter, adapterConfig);
        this._config = await config.database;
        this._sessionCache = {};
        this._transactionLevel = 0;
        this._lockLevel = 0;
        await this._useIfExists();
        this._isInitialized = true;
    },

    renderSql: deligateToAdapter('renderSql'),

    toSql: deligateToAdapter('toSql'),

    async run(...args) {
        return this._fetchRows(
            await this.renderSql(...args)
        );
    },

    exists: deligateToAdapter('exists'),

    create: deligateToAdapter('create'),

    drop: deligateToAdapter('drop'),

    tables: deligateToAdapter('tables'),

    addTable(name){
        return this[name].create();
    },

    removeTable(name){
        return this[name].drop();
    },

    async migrate(...args) {
        await (await new Migrator(this)).migrate(...args);
    },

    transaction: deligateToAdapter('transaction'),

    lock: deligateToAdapter('lock'),

    destroy: deligateToAdapter('destroy'),

    async __getMissing(name){
        if(Union.classes[name]){
            return Union.create(name, this);
        }
        if(Row.classes[name]?.isSingleton){
            const table = Row.classes[name].tableClass.new(this);
            return await table.first() || await this.lock(async () => {
                const out = await table.first();
                if(out) return out;
                await table.insert();
                return await table.first();
            });
        }
        return Table.create(name, this);
    },

    _fetchRows: deligateToAdapter('_fetchRows'),

    _mapRows: deligateToAdapter('_mapRows'),

    _useIfExists: deligateToAdapter('_useIfExists'),

    async __beforeInspect(){
        this._inspectInfo = {
            config: this._config,
            tables: Object.keys(await this.tables()),
            unions: Object.keys(Union.classes)
        };
    },

    __inspect(){
        return `database ${JSON.stringify(this._inspectInfo, null, 2)}`;
    }
});
