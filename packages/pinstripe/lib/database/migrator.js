
import { Base } from '../base.js';
import { Migration } from './migration.js';
import { AsyncPathBuilder } from '../async_path_builder.js'

export const Migrator = Base.extend().include({
    async initialize(database){
        this._database = new AsyncPathBuilder(database);
        this._environment = database._environment;

        if(!await this._database.pinstripeAppliedMigrations.exists()){
            await this._database.pinstripeAppliedMigrations.addColumn('schemaVersion', 'integer');
        }
    },

    async migrate(){
        
        const isDevelopmentEnvironment = (process.env.NODE_ENV || 'development') == 'development';

        for(let i in this.migrations){
            const migration = this.migrations[i];
            if(!await this.isMigrationApplied(migration)){
                if(isDevelopmentEnvironment) console.log(`Applying migration: ${migration.name}`);
                await new migration(this._environment).migrate();
                await this._database.pinstripeAppliedMigrations.insert({schemaVersion: migration.schemaVersion});
            }
        }
    },

    get migrations(){
        if(!this._migrations){
            this._migrations = Object.values(Migration.classes).sort((a, b) => a.schemaVersion - b.schemaVersion)
        }
        return this._migrations;
    },

    async isMigrationApplied(migration){
        return (await this._database.pinstripeAppliedMigrations.schemaVersionEq(migration.schemaVersion).count()) > 0;
    }

});
