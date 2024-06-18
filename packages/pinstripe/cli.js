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
        Command.names.forEach(commandName => {
            if(!Command.for(commandName).internal) Command.unregister(commandName);
        });
    } else {
        Command.names.forEach(commandName => {
            if(!Command.for(commandName).external) Command.unregister(commandName);
        });
    }
    
    try {
        await Workspace.run(async function(){
            await this.runCommand(name, args);
        });
    } catch(e) {
        console.error(e);
    }
})();
