
import { readdir, stat, existsSync } from 'fs'; 
import { promisify } from 'util';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { addFileToClient } from './client.js';

let initialized = false;

const imported = {};
const importQueue = [];

let processImportQueuePromise = null;

export const importAll = (...dirPaths) => {
    if(dirPaths.length){
        importQueue.push(...dirPaths);
    }

    if(!initialized) return Promise.resolve();

    if(!processImportQueuePromise){
        processImportQueuePromise = processImportQueue().then(() => {
            processImportQueuePromise = null;
        });
    }

    return processImportQueuePromise;
};

export const initializeImports = async () => {
    initialized = true;
    await importAll();
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
            const importerFilePath = `${current}/_importer.js`;
            if(existsSync(importerFilePath)){
                const importerFactory = await ( await import(importerFilePath) ).default;
                const importer = await importerFactory(current);
                await importAllRecursive(current, importer);
            } else {
                await importAllRecursive(current, importer);
            }           
        } else if(!imported[current]) {
            imported[current] = true;
            await importer(current);
        }
    }
};

const defaultImporter = async filePath => {
    if(filePath.match(/\/[^\.\/]+(\.client\.js|\.js)$/)){
        await (await import(filePath)).default;
        addFileToClient(filePath);
    }
};

importAll(import.meta.url);
