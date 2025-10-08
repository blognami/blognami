#!/usr/bin/env node

import chalk from 'chalk';

import { Project } from './lib/project.js';
import { Command } from './lib/command.js';
import { importAll } from './lib/import_all.js';
import { Workspace } from './lib/workspace.js';
import { ValidationError } from './lib/validation_error.js';
import { inflector } from '@pinstripe/utils';

(async () => {
    const { entryPath, exists } = await Project.instance;
    const { argv } = process;
    const [name, ...args ] = argv.slice(2);

    if(entryPath){
        import(entryPath);
    }

    await importAll();

    if(exists){
        Command.unregister('generate-project');
    } else {
        Command.names.forEach(commandName => {
            if(commandName == 'list-commands' || commandName == 'generate-project') return;
            Command.unregister(commandName);
        });
    }

    if(process.env.PINSTRIPE_KEEP_INITIALIZE_PROJECT_COMMAND != 'true'){
        Command.unregister('initialize-project');
    }
    
    try {
        await Workspace.run(async function(){
            await this.runCommand(name, args);
        });
    } catch(error) {
        if(error instanceof ValidationError) {
            console.error('');
            console.error('There was an error validating the command parameters:');
            console.error('');
            for(const [field, message] of Object.entries(error.errors)){
                console.error(`  * ${chalk.red(`${inflector.dasherize(field)}: ${message}`)}`);
            }
            console.error('');
            process.exit();
        }
        console.error(error);
    }
})();
