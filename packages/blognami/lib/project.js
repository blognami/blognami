
import { promisify } from 'util';
import { realpath, readFile, existsSync } from 'fs';

import { Class } from './class.js';
import { Singleton } from './singleton.js';

export const Project = Class.extend().include({
    meta(){
        this.include(Singleton)
    },

    async initialize(){
        const configPath = (await findInPath('package.json', process.cwd())).shift();
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
        this.exports = {};
        if(this.config.exports){
            let exports = this.config.exports;
            if(typeof exports != 'object'){
                exports = { '.': exports }
            }
            const exportNames = Object.keys(exports);
            while(exportNames.length){
                const exportName = exportNames.shift();
                const exportPath = exports[exportName];
                const candidateExportPath = `${this.rootPath}/${exportPath}`;
                if(existsSync(candidateExportPath)){
                    this.exports[exportName] = await promisify(realpath)(candidateExportPath);
                }
            }
        }

        this.entryPath = this.exports['.'] || this.main;

        this.localBlognamiPath = (await findInPath('node_modules/.bin/blognami', process.cwd())).shift();
        
        this.nodePaths = await findInPath('node_modules/', process.cwd());
    },

    get exists(){
        return this.configPath !== undefined && this.config?.name !== undefined;
    },

    get name(){
        return this.config?.name || 'unknown';
    }
});

const findInPath = async (offset, base) => {
    const out = [];
    while(base) {
        const candidatePath = `${base}/${offset}`;
        if(existsSync(candidatePath)){
            out.push(await promisify(realpath)(candidatePath));
        }
        if(base == '/'){
            break;
        }
        base = await promisify(realpath)(`${base}/..`);
    }
    return out;
};

