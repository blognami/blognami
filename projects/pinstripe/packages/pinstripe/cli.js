#!/usr/bin/env node

import { Environment, importAll, project } from '@pinstripe/core';
import { spawn } from 'child_process';

(async () => {
    const { mainPath, localPinstripePath } = await project;
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
        Environment.new().run(...args);
    }
})();


