
import { Class } from './class.js';

export const Context = Class.extend().include({
    meta(){
        this.assignProps({ name: 'context' });
    },

    initialize(){
        this.assignProps({ root: this });
    },

    async run(fn){
        let out;
        try {
            out = await fn(this);
        } catch (e){
            await this.destroy();
            throw e;
        }
        await this.destroy();
        return out;
    },

    fork(){
        const out = this.constructor.new();
        out.assignProps({ parent: this, root: this?.root });
        return out;
    },

    async destroy(){
        const resources = Object.values(this);
        while(resources.length){
            const resource = await resources.shift();
            if(typeof resource == 'object' && !(resource instanceof Context) && typeof resource.destroy == 'function'){
                await resource.destroy();
            }
        }
    }
});
