
import { command } from '../command.js';

import { spawn } from 'child_process';
import { promisify } from 'util';

command('generate-project', async ({
    cliUtils: { extractArg, extractOptions },
    fsBuilder: { generateDir, generateFile, echo, line }
}) => {
    const name = extractArg();
    if(!name){
        console.error(`Please give a name.`);
        return;
    }
    
    const { with: dependencies } = extractOptions({
        with: []
    });
    if(!dependencies.includes('pinstripe')){
        dependencies.push('pinstripe');
    }

    await generateDir(name, async () => {
        await generateFile('package.json', () => {
            echo(JSON.stringify({
                type: "module",
                name,
                version: "0.1.0",
                main: "lib/index.js",
                "license": "MIT"
            }, null, 2));
        });

        await generateFile('lib/index.js', () => {
            line();
            line(`import { importAll } from 'pinstripe';`);
            line();
            line(`importAll(import.meta.url)`);
            line();
        });

        await promisify(spawn)('yarn', ['add', ...dependencies], {
            stdio: 'inherit'
        });
    });
    

});


