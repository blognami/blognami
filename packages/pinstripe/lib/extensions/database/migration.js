
import { Class } from '../../class.js';
import { Registry } from '../../registry.js';

export const Migration = Class.extend().include({
    meta(){
        this.assignProps({ name: 'Migration' });

        this.include(Registry);

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
