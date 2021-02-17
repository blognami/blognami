
import { Command } from '../command.js';

Command.register('reset-database').define(dsl => dsl
    .serviceProps('database')
    .props({
        async run(){
            await this.database.drop();
            await this.database.create();
            await this.database.migrate();
        }
    })
);
