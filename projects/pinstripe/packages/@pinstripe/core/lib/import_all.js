
import { readdir, stat, existsSync, readFile } from 'fs';
import { promisify } from 'util';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { default as mimeTypes } from 'mime-types';

import { controller } from './controller.js';
import { view } from './view.js';
import { model } from './model.js';
import { migration } from './database/migration.js';

const importQueue = [];

let processImportQueuePromise = null;

export const importAll = (...args) => {
    if(args.length){
        importQueue.push(...args);
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
}

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

const importAllRecursive = async (dir, importer) => {
    if(existsSync(`${dir}/_importer.js`)) {
        importer = (await (
            await import(`${dir}/_importer.js`)
        ).default)(dir);
    } else if(!importer){
        importer = defaultImporter(dir);
    }

    const items = await promisify(readdir)(dir);
    for(let i in items){
        const item = items[i];
        const stats = await promisify(stat)(`${dir}/${item}`);
        if(stats.isDirectory()){
            await importAllRecursive(`${dir}/${item}`, importer);
        } else {
            await importer(`${dir}/${item}`);
        }
    }
}

export const staticImporter = (dirPath) => {
    return async (filePath) => {
        if(filePath.match(/_importer.js$/)){
            return;
        }
        const name = filePath.substr(dirPath.length).replace(/^\//, '');
        controller(name, async () => [
            200,
            { 'Content-Type': mimeTypes.lookup(filePath) || 'application/octet-stream' },
            [ await promisify(readFile)(filePath) ]
        ]);
    };
};

const jsFilePathPattern = /\/[^\/\.]+.js$/;

export const defaultImporter = (dirPath) => {
    return async (filePath) => {
        if(filePath.match(jsFilePathPattern)){
            await import(filePath);
        }
    };
};

export const controllerImporter = (dirPath) => {
    return async (filePath) => {
        if(!filePath.match(jsFilePathPattern)){
            return;
        }
        if(filePath.match(/_importer.js$/)){
            return;
        }
        const name = filePath.substr(dirPath.length).replace(/^\//, '').replace(/\.js$/, '');
        const { default: fn } = await import(filePath);
        if(typeof fn == 'function'){
            controller(name, fn);
        }
    };
};

export const viewImporter = (dirPath) => {
    return async (filePath) => {
        if(!filePath.match(jsFilePathPattern)){
            return;
        }
        if(filePath.match(/_importer.js$/)){
            return;
        }
        const name = filePath.substr(dirPath.length).replace(/^\//, '').replace(/\.js$/, '');
        const { default: fn } = await import(filePath);
        if(typeof fn == 'function'){
            view(name, fn);
        }
    };
};

export const modelImporter = (dirPath) => {
    return async (filePath) => {
        if(!filePath.match(jsFilePathPattern)){
            return;
        }
        if(filePath.match(/_importer.js$/)){
            return;
        }
        const name = filePath.substr(dirPath.length).replace(/^\//, '').replace(/\.js$/, '');
        const { default: fn, abstract } = await import(filePath);
        if(typeof fn == 'function' && !abstract){
            model(name, fn);
        }
    };
};

export const migrationImporter = (dirPath) => {
    return async (filePath) => {
        if(!filePath.match(jsFilePathPattern)){
            return;
        }
        if(filePath.match(/_importer.js$/)){
            return;
        }
        const name = filePath.substr(dirPath.length).replace(/^\//, '').replace(/\.js$/, '');
        const { default: fn } = await import(filePath);
        if(typeof fn == 'function'){
            migration(name, fn);
        }
    };
};


importAll(import.meta.url);
