
import readline from 'readline';
import path from 'path';
import chalk from 'chalk';
import { FileSystem, Text } from 'haberdash';

export default {
    create(){
        return {
            generateDir: this.generateDir.bind(this),
            generateFile: this.generateFile.bind(this)
        };
    },

    async confirm(question){
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
    },

    async generateDir(dirPath, fn = () => {}){
        if(!path.isAbsolute(dirPath)){
            dirPath = path.normalize(`${process.cwd()}/${dirPath}`);
        }
        if(!await FileSystem.instance.exists(dirPath)){
            console.log(chalk.green(`Creating dir "${dirPath}"`));
            await FileSystem.instance.mkdir(dirPath);
        }

        const previousDirPath = process.cwd();
        process.chdir(dirPath);
        await fn();
        process.chdir(previousDirPath);
    },

    async generateFile(name, ...args){
        const options = typeof args[0] == 'object' ? args.shift() : {};
        const fn = typeof args[0] == 'function' ? args.shift() : () => {};
        const matches = name.match(/^(.*)\/([^\/]*)$/);
        if(matches){
            await this.generateDir(matches[1], () => this.generateFile(matches[2], options, fn));
        } else {
            const data = (await Text.render(fn)).toString();
            const filePath = `${process.cwd()}/${name}`;

            if(!await FileSystem.instance.exists(filePath)){
                console.log(chalk.green(`Creating file "${filePath}"`));
                await FileSystem.instance.writeFile(filePath, data);
            } else if(await FileSystem.instance.readFile(filePath) == data){
                // no change
            } else if(options.skipIfExists){
                console.log(chalk.blue(`Skipping file "${filePath}" (as it already exists)`));
            } else if(options.force || await this.confirm(`Are you sure you want to update ${filePath}?`)){
                console.log(chalk.red(`Updating file "${filePath}"`));
                await FileSystem.instance.writeFile(filePath, data);
            }
        }
    }
};
