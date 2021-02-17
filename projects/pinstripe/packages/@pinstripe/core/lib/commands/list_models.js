
import chalk from 'chalk';

import { Command } from '../command.js';
import { Row } from '../database/row.js';

Command.register('list-models').define(dsl => dsl.props({
    run(){
        console.log('');
        console.log('The following models are available:');
        console.log('');
        Object.keys(Row.classes).sort().forEach(modelName => {
            console.log(`  * ${chalk.green(modelName)}`);
        });
        console.log('');
    }
}));
