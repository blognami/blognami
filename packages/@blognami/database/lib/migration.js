
import { Class } from 'haberdash';
import { ImportableRegistry } from 'blognami';

export const Migration = Class.extend().include({
    meta(){
        this.assignProps({ name: 'Migration' });

        this.include(ImportableRegistry);

        this.assignProps({
            normalizeName: (name) => {
                if(!name.match(/^\d+/)){
                    throw new Error(`Invalid migration name '${name}' - it must begin with a unix timestamp.`);
                }
                return name;
            },

            get schemaVersion(){
                const matches = this.name.match(/^\d+/)
                if(matches){
                    return parseInt(matches[0]);
                }
                return 0;
            }
        });
    },

    initialize(database){
        this.database = database;
    }
});
