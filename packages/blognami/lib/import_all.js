
import { IS_SERVER } from './constants.js';

import { readdir, stat } from 'fs/promises'; // blognami-if-client: const readdir = undefined, stat = undefined;
import { existsSync as exists } from 'fs'; // blognami-if-client: const exists = undefined;
import { dirname } from 'path'; // blognami-if-client: const dirname = undefined;
import { fileURLToPath } from 'url'; // blognami-if-client: const fileURLToPath = undefined;

const imported = {};
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
        const dirPath = await normalizeDirPath(importQueue.shift())
        await importAllRecursive(dirPath, dirPath);
    }
};

const normalizeDirPath = async (dirPath) => {
    let out = dirPath;
    if(out.match(/^file:\/\//)){
        out = await fileURLToPath(out);
    }
    const stats = await stat(out);
    if(!stats.isDirectory()){
        out = await dirname(out);
    }
    return out;
};

const importAllRecursive = async (dirPath, currentDirPath, fileImporter = defaultFileImporter) => {
    const items = await readdir(currentDirPath);
    for(let i in items){
        const item = items[i];
        const currentPath = `${currentDirPath}/${item}`;
        const stats = await stat(currentPath);
        if(stats.isDirectory()){
            const fileImporterFilePath = `${currentPath}/_file_importer.js`;
            if(await exists(fileImporterFilePath)){
                let fileImporter = (await import(fileImporterFilePath)).default;
                if(!fileImporter) continue;
                await importAllRecursive(currentPath, currentPath, fileImporter);
            } else {
                await importAllRecursive(dirPath, currentPath, fileImporter);
            }           
        } else if(!imported[currentPath]) {
            imported[currentPath] = true;
            const filePath = currentPath;
            await fileImporter.importFile({ dirPath, filePath });
        }
    }
};

const defaultFileImporter = {
    async importFile({ filePath }){
        if(filePath.match(/\/[^\.\/]+\.js$/)){
            await import(filePath);
        }
    }
};


if(IS_SERVER) importAll(import.meta.url);

