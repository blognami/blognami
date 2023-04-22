
import { Class } from 'haberdash';
import { Migration } from "./migration.js";

export const Migrator = Class.extend().include({
    initialize(database){
        this.database = database;
    },

    async migrate(){
        if(!await this.database.table('sintraAppliedMigrations').exists){
            await this.database.table('sintraAppliedMigrations', async sintraAppliedMigrations => {
                await sintraAppliedMigrations.addColumn('schemaVersion', 'integer');
            });
        }
        const isDevelopmentEnvironment = (process.env.NODE_ENV || 'development') == 'development';
        const migrations = Migration.names.map(name => Migration.for(name)).sort((a, b) => a.schemaVersion - b.schemaVersion);
        for(let i in migrations){
            const migration = migrations[i];
            const isMigrationApplied = await this.database.table('sintraAppliedMigrations').where({ schemaVersion: migration.schemaVersion }).count() > 0;
            if(!isMigrationApplied){
                if(isDevelopmentEnvironment) console.log(`Applying migration: ${migration.name}`);
                await migration.new(this.database).migrate();
                await this.database.table('sintraAppliedMigrations').insert({ schemaVersion: migration.schemaVersion });
            }
        }
    }
});