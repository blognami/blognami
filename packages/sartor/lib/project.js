
import { existsSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

import { Class, AbstractSingleton } from 'haberdash';

export const Project = Class.extend('Project').include({
    meta(){
        this.include(AbstractSingleton);
    },

    initialize(){
        const cwd = process.cwd();
        let dir = cwd;
        while(true){
            if(basename(dir) === '.sartor'){
                this.rootPath = dirname(dir);
                this.exists = true;
                this.insideSartor = true;
                return;
            }
            if(existsSync(join(dir, '.sartor'))){
                this.rootPath = dir;
                this.exists = true;
                this.insideSartor = false;
                return;
            }
            const parent = dirname(dir);
            if(parent === dir){
                this.rootPath = cwd;
                this.exists = false;
                this.insideSartor = false;
                return;
            }
            dir = parent;
        }
    },

    get sartorPath(){
        return join(this.rootPath, '.sartor');
    }
});
