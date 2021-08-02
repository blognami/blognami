
import chalk from 'chalk';
import { defineCommand } from 'pinstripe';

import { Command } from '../command.js';

defineCommand('list-commands', () => {
    console.log('');
    console.log('The following commands are available:');
    console.log('');
    Object.keys(Command.classes).sort().forEach(commandName => {
        console.log(`  * ${chalk.green(commandName)}`);
    });
    console.log('');
});
