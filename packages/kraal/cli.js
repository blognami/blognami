#!/usr/bin/env node

import 'haberdash/node';
import chalk from 'chalk';
import { spawnSync } from 'child_process';
import { existsSync, realpathSync } from 'fs';
import { dirname, join } from 'path';

import { importAll, ValidationError, inflector } from 'haberdash';
import { ServiceFactory, Command, Project } from './lib/index.js';
import { registerConfigCommands } from './lib/register_config_commands.js';

const realpathOrNull = path => {
    try { return realpathSync(path); } catch { return null; }
};

(async () => {
    const [name, ...args] = process.argv.slice(2);

    const project = Project.instance;

    // Delegate to the project-local kraal binary (the project's pinned
    // version) when it isn't the one already running.
    if (project.exists) {
        const self = realpathOrNull(process.argv[1]);
        let bin;
        let search = project.rootPath;
        while (true) {
            const candidate = join(search, 'node_modules', '.bin', 'kraal');
            if (existsSync(candidate)) {
                bin = candidate;
                break;
            }
            const parent = dirname(search);
            if (parent === search) break;
            search = parent;
        }
        if (bin && self && realpathOrNull(bin) !== self) {
            const result = spawnSync(bin, process.argv.slice(2), { stdio: 'inherit' });
            process.exit(result.status ?? 1);
        }
    }

    await importAll();

    if (project.exists) {
        Command.unregister('generate-project');
    } else {
        Command.names.forEach(commandName => {
            if (commandName === 'list-commands' || commandName === 'generate-project') return;
            Command.unregister(commandName);
        });
    }

    try {
        const exitCode = await ServiceFactory.Workspace.run(async function(){
            registerConfigCommands(await this.config);
            return this.runCommand(name, args);
        });
        if (typeof exitCode === 'number') process.exit(exitCode);
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
        process.exit(1);
    }
})();
