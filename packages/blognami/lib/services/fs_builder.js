
import readline from 'readline';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import { promisify } from 'util';

export default {
    create(){
        let outputBuffer = [];
    
        const echo = (stringable) => {
            outputBuffer.push(`${stringable}`);
        };
    
        const grab = (fn) => {
            const previousOutputBuffer = outputBuffer;
            outputBuffer = [];
            fn();
            const out = outputBuffer;
            outputBuffer = previousOutputBuffer;
            return out;
        };
    
        const line = (stringable = '') => {
            if(outputBuffer.length){
                echo(`\n${stringable}`);
            } else {
                echo(stringable);
            }
        };
    
        const indent = (fn) => {
            const lines = grab(fn);
            if(!lines.length){
                return;
            }
            lines.join('').split(/\n/).forEach((string) => {
                line(`    ${string}`);
            });
        };
    
        const confirm = async (question) => {
            while(true){
                const answer = (await new Promise((resolve) => {
                    const rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });
                    rl.question(`${question.replace(/\?+$/, '')}? Y/n/a: `, answer => {
                        rl.close();
                        resolve(answer);
                    });
                })).toLowerCase();
                
                if(answer == '' || answer == 'y'){
                    return true;
                } else if(answer == 'n'){
                    return false;
                } else if(answer == 'a'){
                    process.exit();
                }
            }
        };
    
    
        const generateDir = async (dirPath, fn = () => {}) => {
            if(!path.isAbsolute(dirPath)){
                dirPath = path.normalize(`${process.cwd()}/${dirPath}`);
            }
            if(!fs.existsSync(dirPath)){
                console.log(chalk.green(`Creating dir "${dirPath}"`));
                const dirSegments = dirPath.replace(/^\//, '').split(/\//);
                const currentDirSegments = [];
                while(dirSegments.length){
                    currentDirSegments.push(dirSegments.shift());
                    const currentPath = `/${currentDirSegments.join('/')}`;
                    if(!fs.existsSync(currentPath)){
                        await promisify(fs.mkdir)(currentPath);
                    }
                }
            }
    
            const previousDirPath = process.cwd();
            process.chdir(dirPath);
            await fn();
            process.chdir(previousDirPath);
        };
    
        const generateFile = async (name, ...args) => {
            const options = typeof args[0] == 'object' ? args.shift() : {};
            const fn = typeof args[0] == 'function' ? args.shift() : () => {};
            const matches = name.match(/^(.*)\/([^\/]*)$/);
            if(matches){
                await generateDir(matches[1], () => generateFile(matches[2], options, fn));
            } else {
                const data = (grab(fn)).join('');
                const filePath = `${process.cwd()}/${name}`;
    
                if(!fs.existsSync(filePath)){
                    console.log(chalk.green(`Creating file "${filePath}"`));
                    await promisify(fs.writeFile)(name, data);
                } else if(await promisify(fs.readFile)(name) == data){
                    // no change (so ignore)
                } else if(options.skipIfExists){
                    console.log(chalk.blue(`Skipping file "${filePath}" (as it already exists)`));
                } else if(options.force || await confirm(`Are you sure you want to update ${filePath}?`)){
                    console.log(chalk.red(`Updating file "${filePath}"`));
                    await promisify(fs.writeFile)(name, data);
                }
            }
        };
    
        const inProjectRootDir = async (fn) => {
            const previousDirPath = process.cwd();
            process.chdir(await this.project.rootPath);
            await fn();
            process.chdir(previousDirPath);
        };
    
        return {
            echo,
            grab,
            line,
            indent,
            confirm,
            generateDir,
            generateFile,
            inProjectRootDir
        };
    }
};
