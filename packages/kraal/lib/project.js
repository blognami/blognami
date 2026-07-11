
import { statSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { Class, AbstractSingleton } from 'haberdash';

export const Project = Class.extend('Project').include({
    meta(){
        this.include(AbstractSingleton);
    },

    initialize(){
        const cwd = process.cwd();
        let dir = cwd;
        while(true){
            if(statSync(join(dir, 'kraal.js'), { throwIfNoEntry: false })?.isFile()){
                this.rootPath = dir;
                this.exists = true;
                return;
            }
            const parent = dirname(dir);
            if(parent === dir){
                this.rootPath = cwd;
                this.exists = false;
                return;
            }
            dir = parent;
        }
    },

    get configPath(){
        return join(this.rootPath, 'kraal.js');
    }
});
