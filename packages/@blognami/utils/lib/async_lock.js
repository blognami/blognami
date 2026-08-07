
import { Class } from './class.js';

export const AsyncLock = Class.extend().include({
    initialize(){
        this.promise = Promise.resolve();
    },

    async lock(...args){
        const fn = args.pop();
        const [options = {}] = args;
        const { skip = false } = options;
        if(skip) return fn();
        while(this._lock){
            await this._lock;
        }
        this._lock = (async () => {
            try {
                await fn();
            } finally {
                delete this._lock;
            }
        })();
        await this._lock;
    },
});
