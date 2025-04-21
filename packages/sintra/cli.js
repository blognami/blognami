#!/usr/bin/env node

import { Project } from './lib/project.js';
import { Command } from './lib/command.js';
import { importAll } from './lib/import_all.js';
import { Workspace } from './lib/workspace.js';

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

    if(process.env.SINTRA_KEEP_INITIALIZE_PROJECT_COMMAND != 'true'){
        Command.unregister('initialize-project');
    }
    
    try {
        await Workspace.run(async function(){
            await this.runCommand(name, args);
        });
    } catch(e) {
        console.error(e);
    }
})();
