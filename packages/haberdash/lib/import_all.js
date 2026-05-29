
import { FileSystem } from './file_system.js';

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
        const { fileURLToPath } = await import('node:url');
        out = fileURLToPath(out);
    }
    try {
        await FileSystem.instance.readDir(out);
        return out;
    } catch {
        const { dirname } = await import('node:path');
        return dirname(out);
    }
};

const importAllRecursive = async (dirPath, currentDirPath, fileImporter = defaultFileImporter) => {
    const items = (await FileSystem.instance.readDir(currentDirPath)).sort();
    for(let i in items){
        const item = items[i];
        const currentPath = `${currentDirPath}/${item}`;
        let subItems;
        try {
            subItems = await FileSystem.instance.readDir(currentPath);
        } catch {
            if(!imported[currentPath]) {
                imported[currentPath] = true;
                const filePath = currentPath;
                await fileImporter.importFile({ dirPath, filePath });
            }
            continue;
        }
        if(subItems.includes('_file_importer.js')){
            const fileImporterFilePath = `${currentPath}/_file_importer.js`;
            let fileImporter = (await import(fileImporterFilePath)).default;
            if(!fileImporter) continue;
            await importAllRecursive(currentPath, currentPath, fileImporter);
        } else {
            await importAllRecursive(dirPath, currentPath, fileImporter);
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
