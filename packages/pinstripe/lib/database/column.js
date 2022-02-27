
import { Base } from "../base.js";
import { createAdapterDeligator } from './adapter.js';

const deligateToAdapter = createAdapterDeligator('column');

export const Column = Base.extend().include({
    initialize(table, name, type){
        this._adapter = table._database._adapter;
        this._table = table;
        this._name = name;
        this._type = type;
    },

    renderSql: deligateToAdapter('renderSql'),

    toSql: deligateToAdapter('toSql'),

    async type(){
        if(!this._type){
            this._type = (await this._table[this._name])._type;
        }
        return this._type;
    },

    async exists(){
        return (await this.type()) !== undefined;
    },

    create: deligateToAdapter('create'),

    drop: deligateToAdapter('drop'),

    async __beforeInspect(){
        const exists = await this.exists();
        this._inspectInfo = {
            exists,
            ...(() => {
                if(exists){
                    return {
                        type: this._type
                    };
                }
                return {};
            })()
        };
    },

    __inspect(){
        return `${this._name} (Column) ${JSON.stringify(this._inspectInfo, null, 2)}`;
    }
});
