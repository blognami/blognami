
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
            if(basename(dir) === '.cardoon'){
                this.rootPath = dirname(dir);
                this.exists = true;
                this.insideCardoon = true;
                return;
            }
            if(existsSync(join(dir, '.cardoon'))){
                this.rootPath = dir;
                this.exists = true;
                this.insideCardoon = false;
                return;
            }
            const parent = dirname(dir);
            if(parent === dir){
                this.rootPath = cwd;
                this.exists = false;
                this.insideCardoon = false;
                return;
            }
            dir = parent;
        }
    },

    get cardoonPath(){
        return join(this.rootPath, '.cardoon');
    }
});
