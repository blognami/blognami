export default {
    meta(){
        this.hasMany('revisions',  { fromKey: 'id', toKey: 'revisableId' });

        this.assignProps({
            get revisableFields(){
                if(!this._revisableFields){
                    this._revisableFields = [];
                }
                return this._revisableFields
            },

            trackRevisionsFor(name){
                this.revisableFields.push(name);
            }
        });

        this.addHook(['beforeInsert', 'beforeUpdate'], async function(){
            if(!this.revisionUserId) return;
            this._revisedFields = {};
            this.constructor.revisableFields.forEach(name => {
                if(this[name] != this._initialFields[name]){
                    this._revisedFields[name] = this[name];
                }
            });
        });

        this.addHook(['afterInsert', 'afterUpdate'], async function(){
            if(!this.revisionUserId) return;
            for(let name in this._revisedFields){
                await this.database.revisions.insert({
                    revisableId: this.id,
                    userId: this.revisionUserId,
                    name,
                    value: this._revisedFields[name],
                });
            }
        });
    },

    set revisionUserId(value){
        this._revisionUserId = value;
    },

    get revisionUserId(){
        return this._revisionUserId;
    }
};