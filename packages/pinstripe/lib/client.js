
import { promisify } from 'util';
import { readFile } from 'fs';
import { Volume as MemFs } from 'memfs';
import * as fs from 'fs';
import { Union as UnionFs } from 'unionfs';

import { Base } from './base.js';
import { overload } from './overload.js';

export const client = Base.extend().include({
    initialize(){
        this.files = {};
    },

    addFile: overload({
        ['string, function'](filePath, fn){
            this.files[filePath] = fn;
        },

        string(filePath){
            this.addFile(filePath, async () => {
                return (await promisify(readFile)(filePath)).toString();
            });
        },
    }),

    async createFs(entryFilePath){
        const files = {};
        const filePaths = Object.keys(this.files);
        while(filePaths.length){
            const filePath = filePaths.pop();
            const data = await this.files[filePath]();
            files[filePath] = data.replace(/(.*)\/\/\s*pinstripe-if-client:\s*(.*)/g, '$2 // pinstripe-if-server: $1');
        }
        return new UnionFs().use(fs).use(new MemFs.fromJSON({
            ...files,
            [entryFilePath]: `
                ${
                    Object.keys(this.files).filter(filePath => filePath.match(/\/[^\.\/]+(\.client\.js)$/)).map(filePath => `
                        import ${JSON.stringify(filePath)};
                    `).join('\n')
                }
            `
        }));
    }
}).new();

export const addFileToClient = (...args) => client.addFile(...args);
