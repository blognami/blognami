
import { IS_SERVER } from './constants.js';

import { readdir, stat } from 'fs/promises'; // pinstripe-if-client: const readdir = undefined, stat = undefined;
import { existsSync as exists } from 'fs'; // pinstripe-if-client: const exists = undefined;
import { dirname } from 'path'; // pinstripe-if-client: const dirname = undefined;
import { fileURLToPath } from 'url'; // pinstripe-if-client: const fileURLToPath = undefined;

import { FileImporter } from './file_importer.js';
import './file_importers/default.js.js';

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

const importAllRecursive = async (dirPath, currentDirPath, fileImporterConfig) => {
    const items = await readdir(currentDirPath);
    for(let i in items){
        const item = items[i];
        const currentPath = `${currentDirPath}/${item}`;
        const stats = await stat(currentPath);
        if(stats.isDirectory()){
            const fileImporterConfigFilePath = `${currentPath}/_file_importer.js`;
            if(await exists(fileImporterConfigFilePath)){
                let fileImporterConfig = (await import(fileImporterConfigFilePath)).default;
                if(!fileImporterConfig) continue;
                await importAllRecursive(currentPath, currentPath, fileImporterConfig);
            } else {
                await importAllRecursive(dirPath, currentPath, fileImporterConfig);
            }           
        } else if(!imported[currentPath]) {
            imported[currentPath] = true;
            await FileImporter.importFile(dirPath, currentPath, fileImporterConfig);
        }
    }
};

if(IS_SERVER) {
    importAll(`${import.meta.url}/../file_importers`);
    importAll(import.meta.url);
}
