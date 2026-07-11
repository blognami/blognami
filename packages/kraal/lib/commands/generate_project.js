
import path from 'path';
import { existsSync, writeFileSync } from 'fs';
import chalk from 'chalk';

export default {
    meta(){
        this.assignProps({
            description: 'Generates a kraal.js config file for the current project.'
        });
    },

    async run(){
        const target = path.join(process.cwd(), 'kraal.js');

        if(existsSync(target)){
            console.log(chalk.red('kraal.js already exists — remove it or run in a clean directory'));
            process.exit(1);
        }

        const slug = path.basename(process.cwd());

        writeFileSync(target, `export default {
    sandbox: {
        provider: 'docker',
        name: '${slug}-kraal-sandbox',

        // Env vars passed into the sandbox container.
        env: {},

        // Shell script run as root (sh -e) at image build time, after the
        // kraal user exists — add the tools your sandboxed commands need.
        install: \`\`
    }
};
`);

        console.log(chalk.green(`Creating file "${target}"`));
    }
};
