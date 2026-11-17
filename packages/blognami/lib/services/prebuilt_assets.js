import { readFile } from 'fs/promises';
import { join } from 'path';

import { STATIC_ASSET_HEADER } from '../view.js';

export const PREBUILT_ASSETS_DIR = 'build/static-assets';

const ON_THE_FLY_ENVIRONMENTS = ['development', 'test'];

export default {
    create(){
        return {
            read: this.read.bind(this),
            handOver: this.handOver.bind(this)
        };
    },

    async read(pathname){
        if(ON_THE_FLY_ENVIRONMENTS.includes(await this.environment)) return;

        const { rootPath } = await this.project;
        try {
            return await readFile(join(rootPath, PREBUILT_ASSETS_DIR, pathname.replace(/^\//, '')), 'utf8');
        } catch(error){
            if(error.code == 'ENOENT') return;
            throw error;
        }
    },

    // Only the server service worker calls it: a response naming the stored file, whatever the environment.
    handOver(pathname, contentType){
        return [200, { 'content-type': contentType, [STATIC_ASSET_HEADER]: encodeURI(pathname.replace(/^\//, '')) }, []];
    }
};
