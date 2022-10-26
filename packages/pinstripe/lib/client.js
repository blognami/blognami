import { fileURLToPath } from 'url';

import { Class } from "./class.js";
import { Singleton } from "./singleton.js";


export const Client = Class.extend().include({
    meta(){
        this.include(Singleton);
    },

    initialize(){
        this.modules = [];

        this.addModule(`import ${JSON.stringify(fileURLToPath(`${import.meta.url}/../index.js`))};`);
    },

    addModule(...modules){
        this.modules.push(...modules);
    }
});
