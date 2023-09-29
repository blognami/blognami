#!/usr/bin/env node

import { spawn } from 'child_process';

import { Project } from './lib/project.js';
import { Command } from './lib/command.js';
import { importAll } from './lib/import_all.js';
import { Workspace } from './lib/workspace.js';

(async () => {
    const { entryPath, localHaberdashPath, exists } = await Project.instance;
    const { argv, env, execPath } = process;
    const args = argv.slice(2);

    if (env.IS_LOCAL_HABERDASH != 'true' && localHaberdashPath) {
        spawn(execPath, [localHaberdashPath, ...args], {
            env: { ...env, IS_LOCAL_HABERDASH: 'true' },
            stdio: 'inherit'
        });
    } else {
        if(entryPath){
            import(entryPath);
        }

        await importAll();

        if(exists){
            Command.unregister('generate-project');
        } else {
            const allowedCommands = ['generate-project', 'list-commands'];
            Command.names.forEach(commandName => {
                if(!allowedCommands.includes(commandName)){
                    Command.unregister(commandName);
                }
            });
        }
        
        try {
            await Workspace.run(async function(){
                await this.runCommand(...args);
            });
        } catch(e) {
            console.error(e);
        }
    }
})();
