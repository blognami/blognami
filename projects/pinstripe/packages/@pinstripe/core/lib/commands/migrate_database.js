
import { Command } from '../command.js';

Command.register('migrate-database').define(dsl => dsl
    .serviceProps('database')
    .props({
        async run(){
            await this.database.migrate();
        }
    })
);
