
import { spawnSync } from 'node:child_process';
import { chdir, cwd } from 'node:process';
import chalk from 'chalk';
import stripAnsi from 'strip-ansi';

export function run(command){
    console.log(chalk.bold(chalk.blue(`run: ${command}`)));
    console.log('');
    const { stdout, stderr } = spawnSync(command, { shell: true });
    const out = {
        stdout: stripAnsi(stdout.toString() || '').trim(),
        stderr: stripAnsi(stderr.toString() || '').trim()
    };

    if(out.stdout){
        console.log(out.stdout);
    }

    if(out.stderr){
        console.log(out.stderr);
    }

    console.log('');

    return out;
}

export function inPackagesDir(fn){
    const currentDir = cwd();
    chdir('../../../');
    fn();
    chdir(currentDir);
}

export function reset(){
    inPackagesDir(() => {
        run(`rm -rf *test`);
        run(`git checkout -- ../package-lock.json`);
    });
}
