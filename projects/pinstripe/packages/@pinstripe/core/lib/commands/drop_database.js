
import { Command } from '../command.js';

Command.register('drop-database').define(dsl => dsl
    .serviceProps('database')
    .props({
        async run(){
            await this.database.drop();
        }
    })
);
