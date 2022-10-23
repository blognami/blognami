
import { readdir, stat, existsSync } from 'fs'; 
import { promisify } from 'util';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

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
        out = fileURLToPath(out);
    }
    const stats = await promisify(stat)(out);
    if(!stats.isDirectory()){
        out = dirname(out);
    }
    return out;
};

const importAllRecursive = async (dirPath, currentDirPath, fileImporter = defaultFileImporter) => {
    const items = await promisify(readdir)(currentDirPath);
    for(let i in items){
        const item = items[i];
        const currentPath = `${currentDirPath}/${item}`;
        const stats = await promisify(stat)(currentPath);
        if(stats.isDirectory()){
            const fileImporterFilePath = `${currentPath}/_file_importer.js`;
            if(existsSync(fileImporterFilePath)){
                let fileImporter = (await import(fileImporterFilePath)).default;
                if(!fileImporter) continue;
                await importAllRecursive(currentPath, currentPath, fileImporter);
            } else {
                await importAllRecursive(dirPath, currentPath, fileImporter);
            }           
        } else if(!imported[currentPath]) {
            imported[currentPath] = true;
            //TODO: simplify (only pass filePath and dirPath)
            const filePath = currentPath;
            const relativeFilePath = filePath.substr(dirPath.length).replace(/^\//, '');
            const relativeFilePathWithoutExtension = relativeFilePath.replace(/\.[^/.]+$/, '');
            const extension = relativeFilePath.replace(/^.*\./, '');
            await fileImporter.importFile({ dirPath, filePath, relativeFilePath, relativeFilePathWithoutExtension, extension });
        }
    }
};

//TODO: simplify convert to simple function, rename to defaultImporter?
const defaultFileImporter = {
    async importFile({ filePath }){
        if(filePath.match(/\/[^\.\/]+\.js$/)){
            await import(filePath);
        }
    }
};

importAll(import.meta.url);
