#!/usr/bin/env node

import { Environment, importAll, project, Command } from '@pinstripe/core';
import { spawn } from 'child_process';

(async () => {
    const { mainPath, localPinstripePath, exists: projectExists, config: projectConfig } = await project;
    const { argv, env, execPath } = process;
    const args = argv.slice(2);

    if (env.IS_LOCAL_PINSTRIPE != 'true' && localPinstripePath) {
        spawn(execPath, [localPinstripePath, ...args], {
            env: { ...env, IS_LOCAL_PINSTRIPE: 'true' },
            stdio: 'inherit'
        });
    } else {
        await importAll();
        if(mainPath){
            await import(mainPath);
            await importAll();
        }

        if(!projectExists || projectConfig?.workspaces){
            Object.keys(Command.classes).forEach((commandName) => {
                if(!['generate-project', 'list-commands'].includes(commandName)){
                    Command.unregister(commandName);
                }
            })
        } else {
            Command.unregister('generate-project');
        }

        Environment.new().run(...args);
    }
})();


