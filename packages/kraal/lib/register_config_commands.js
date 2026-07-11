
import chalk from 'chalk';

import { Command } from './command.js';

// Registers a `kraal` subcommand for each entry in `config.sandbox.commands`.
// Each command runs its shell string inside the sandbox, mirroring run-in-sandbox.
export function registerConfigCommands(config){
    for(const [name, command] of Object.entries(config?.sandbox?.commands ?? {})){
        if(Command.names.includes(Command.normalizeName(name))){
            console.error(chalk.yellow(`Skipping custom command "${name}": a command with that name already exists.`));
            continue;
        }

        Command.register(name, {
            meta(){
                this.assignProps({ description: `Runs \`${command}\` inside the sandbox.` });
            },

            async run(){
                const result = await this.sandbox.run(command, { interactive: true });
                process.exit(result.exitCode);
            }
        });
    }
}
