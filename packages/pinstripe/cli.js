#!/usr/bin/env node --unhandled-rejections=strict

import { spawn } from 'child_process';

import { importAll } from './lib/import_all.js';
import { project } from './lib/project.js';
import { Command } from './lib/command.js';
import { Environment } from './lib/environment.js';

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
        await importAll();
        if(entryPath){
            await import(entryPath);
            await importAll();
        }

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

        const { runCommand, resetEnvironment } = Environment.new();
        try {
            await runCommand(...args);
        } catch(e) {
            console.error(e);
        }
        await resetEnvironment();
    }
})();
