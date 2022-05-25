#!/usr/bin/env node

import { spawn } from 'child_process';

import { project } from './lib/project.js';
import { Command } from './lib/command.js';
import { createEnvironment } from './lib/environment.js';

(async () => {
    const { entryPath, localPinstripePath, exists } = await project;
    const { argv, env, execPath } = process;
    const args = argv.slice(2);

    if (env.IS_LOCAL_PINSTRIPE != 'true' && localPinstripePath) {
        spawn(execPath, [localPinstripePath, ...args], {
            env: { ...env, IS_LOCAL_PINSTRIPE: 'true' },
            stdio: 'inherit'
        });
    } else {
        if(entryPath){
            import(entryPath);
        }

        const { runCommand, resetEnvironment } = await createEnvironment();

        if(exists){
            Command.unregister('generate-project');
        } else {
            const allowedCommands = ['generate-project', 'list-commands']
            Object.keys(Command.classes).forEach(commandName => {
                if(!allowedCommands.includes(commandName)){
                    Command.unregister(commandName);
                }
            });
        }
        
        try {
            await runCommand(...args);
        } catch(e) {
            console.error(e);
        }
        await resetEnvironment();
    }
})();
