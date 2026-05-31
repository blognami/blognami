#!/usr/bin/env node

import 'haberdash/node';
import chalk from 'chalk';
import { spawnSync } from 'child_process';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { pathToFileURL } from 'url';

import { importAll, ValidationError, inflector } from 'haberdash';
import { ServiceFactory, Command, Project } from './lib/index.js';

(async () => {
    const [name, ...args] = process.argv.slice(2);

    const project = Project.instance;

    if (project.exists && !project.insideCardoon) {
        const cardoonDir = project.cardoonPath;
        let bin;
        let search = cardoonDir;
        while (true) {
            const candidate = join(search, 'node_modules', '.bin', 'cardoon');
            if (existsSync(candidate)) {
                bin = candidate;
                break;
            }
            const parent = dirname(search);
            if (parent === search) break;
            search = parent;
        }
        if (bin) {
            const result = spawnSync(bin, process.argv.slice(2), { stdio: 'inherit', cwd: cardoonDir });
            process.exit(result.status ?? 1);
        } else {
            process.stderr.write(chalk.red('cardoon binary not found in any node_modules/.bin/ above .cardoon/ — run `npm install` in .cardoon/ or in a workspace ancestor') + '\n');
            process.exit(1);
        }
    }

    await importAll();

    if (project.insideCardoon) {
        const entry = join(project.cardoonPath, 'lib', 'index.js');
        if (existsSync(entry)) {
            await import(pathToFileURL(entry).href);
            await importAll();
        }
    }

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
