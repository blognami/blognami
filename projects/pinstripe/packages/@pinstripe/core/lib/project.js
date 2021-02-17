
import { promisify } from 'util';
import { realpath, readFile, existsSync } from 'fs';

import { Base } from './base.js';

const Project = Base.extend().define(dsl => dsl
    .props({
        async initialize(){
            const configPath = await findInPath('package.json', process.cwd());
            if(!configPath){
                return;
            }
            this.configPath = configPath;
            this.rootPath = await promisify(realpath)(`${configPath}/..`);
            this.config = JSON.parse(await promisify(readFile)(configPath));
            const candidateMainPath = `${this.rootPath}/${this.config.main}`;
            if(existsSync(candidateMainPath)){
                this.mainPath = await promisify(realpath)(candidateMainPath);
            }
        },

        get exists(){
            return this.configPath !== undefined;
        },

        get name(){
            return this.config?.name || 'unknown';
        }
    })
);

const findInPath = async (offset, base) => {
    if(!base){
        return;
    }
    while(true) {
        const candidatePath = `${base}/${offset}`;
        if(existsSync(candidatePath)){
            return await promisify(realpath)(candidatePath);
        }
        if(base == '/'){
            break;
        }
        base = await promisify(realpath)(`${base}/..`);
    }
};

export const project = Project.new();
