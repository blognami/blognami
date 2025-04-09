
import chalk from 'chalk';
import { Command } from 'sintra';

export default {
    meta(){
        this.assignProps({
            external: true,
        });
    },

    run(){
        console.log('');
        console.log('The following commands are available:');
        console.log('');
        Command.names.forEach(commandName => {
            console.log(`  * ${chalk.green(commandName)}`);
        });
        console.log('');
    }
};
