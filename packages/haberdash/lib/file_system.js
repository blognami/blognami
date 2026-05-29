
import { Class } from './class.js';
import { AbstractSingleton } from './abstract_singleton.js';

export const FileSystem = Class.extend().include({
    meta(){ this.include(AbstractSingleton); },
    async readFile(path){ throw new Error('FileSystem not patched — import "haberdash/node" or equivalent'); },
    async readDir(path){ throw new Error('FileSystem not patched — import "haberdash/node" or equivalent'); },
    async writeFile(path, data){ throw new Error('FileSystem not patched — import "haberdash/node" or equivalent'); },
    async mkdir(path, options){ throw new Error('FileSystem not patched — import "haberdash/node" or equivalent'); },
    async exists(path){ throw new Error('FileSystem not patched — import "haberdash/node" or equivalent'); },
});
