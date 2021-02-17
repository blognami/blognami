
import { Command } from '../command.js';

Command.register('create-database').define(dsl => dsl
    .serviceProps('database')
    .props({
        async run(){
            await this.database.create();
        }
    })
);
