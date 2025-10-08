
import chalk from 'chalk';
import { Command } from 'pinstripe';

export default {
    meta(){
        this.annotate({
            description: 'Lists all available commands and shows how to get help for specific commands.'
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
        console.log('For more information on a specific command, run:');
        console.log('');
        console.log(chalk.cyan('  pinstripe COMMAND_NAME --help'));
        console.log('');
    }
};
