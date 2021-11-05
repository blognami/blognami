

import { Base } from '../base.js';
import { Registrable } from '../registrable.js';
import { overload } from '../overload.js';
import { thatify } from '../thatify.js';
import { addFileToClient } from '../client.js';

export const Migration = Base.extend().include({
    meta(){
        this.include(Registrable);

        const { register } = this;

        this.assignProps({
            register(name){
                if(!name.match(/^\d+/)){
                    throw new Error(`Invalid migration name '${name}' - it must begin with a unix timestamp`);
                }
                return register.call(this, name);
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
    
    initialize(environment){
        this.environment = environment;
    },

    migrate(){
        
    },

    __getMissing(name){
        return this.environment[name];
    }
});

export const defineMigration = overload({
    ['string, object'](name, include){
        const abstract = include.abstract;
        delete include.abstract;
        Migration.register(name, abstract).include(include);
    },

    ['string, function'](name, fn){
        defineMigration(name, { migrate: thatify(fn) });
    }
});

export const migrationImporter = dirPath => {
    return async filePath => {
        const relativeFilePath = filePath.substr(dirPath.length).replace(/^\//, '');

        if(filePath.match(/\.js$/)){
            const relativeFilePathWithoutExtension = relativeFilePath.replace(/\.[^/]+$/, '');
            if(relativeFilePathWithoutExtension == '_importer'){
                return;
            }
            addFileToClient(filePath);
            const definition = await ( await import(filePath) ).default;
            if(definition !== undefined){
                defineMigration(relativeFilePathWithoutExtension, definition);
            }
            return;
        }
    };
};