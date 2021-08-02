
import { readdir, stat } from 'fs'; 
import { promisify } from 'util';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineController } from 'pinstripe';

export const imported = {};
const importQueue = [];

let processImportQueuePromise = null;

export const importAll = (...dirPaths) => {
    if(dirPaths.length){
        importQueue.push(...dirPaths);
    }

    if(!processImportQueuePromise){
        processImportQueuePromise = processImportQueue().then(() => {
            processImportQueuePromise = null;
        });
    }

    return processImportQueuePromise;
};

const processImportQueue = async () => {
    while(importQueue.length > 0){
        await importAllRecursive(await normalizeDirPath(importQueue.shift()));
    }
};

const normalizeDirPath = async (dirPath) => {
    let out = dirPath;
    if(out.match(/^file:\/\//)){
        out = fileURLToPath(out);
    }
    const stats = await promisify(stat)(out);
    if(!stats.isDirectory()){
        out = dirname(out);
    }
    return out;
};

const importAllRecursive = async (dirPath, importer = defaultImporter) => {
    const items = await promisify(readdir)(dirPath);
    for(let i in items){
        const item = items[i];
        const current = `${dirPath}/${item}`;
        const stats = await promisify(stat)(current);
        if(stats.isDirectory()){
            await importAllRecursive(current, item == 'static' ? createStaticImporter(current) : importer);
        } else if(!imported[current]) {
            imported[current] = true;
            await importer(current);
        }
    }
};

const defaultImporter = async filePath => {
    if(filePath.match(/\/[^\.\/]+(\.client\.js|\.js)$/)){
        await (await import(filePath)).default;
    }
};

const createStaticImporter = dirPath => async filePath => {
    const relativeFilePath = filePath.substr(dirPath.length).replace(/^\//, '');
    defineController(relativeFilePath, ({ renderFile }) => renderFile(filePath));
};

importAll(import.meta.url);
