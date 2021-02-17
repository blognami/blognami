
import { Command } from '../command.js';

Command.register('init-database').define(dsl => dsl
    .serviceProps('database')
    .props({
        async run(){
            await this.database.create();
            await this.database.migrate();
        }
    })
);
