
export default {
    meta(){
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

        // this.afterInsert(async function(){
        //     console.log(`----------- createdByUserId: ${this.createdByUserId}`);
        // });

        // this.afterUpdate(async function(){
        //     console.log(`----------- updatedByUserId: ${this.updatedByUserId}`);
        // });

        this.beforeUpdate(async function(){
            this._revisedFields = {};
            this.constructor.revisableFields.forEach(name => {
                if(this[name] != this._initialFields[name]){
                    this._revisedFields[name] = this._initialFields[name];
                }
            });
        });

        this.afterUpdate(async function(){
            for(let name in this._revisedFields){
                await this.database.revisions.insert({
                    revisableId: this.id,
                    name,
                    value: this._revisedFields[name],
                });
            }
        });
    }
};
