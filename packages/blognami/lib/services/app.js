
import { App } from '../app.js';


let cache;

export const client = {
    create(){
        return this.defer(async () => {
            if(!this.context.root.hasOwnProperty('app')){
                if(!cache) cache = fetch('/_blognami/_shell/services/app.json').then(response => response.json());
                const app = await cache;
                this.context.root.app = App.create(app, this.context.root);
            }
            return this.context.root.app;
        });
    }
};

export default {
    create(){
        return this.defer(async () => {
            if(!this.context.root.hasOwnProperty('app')){
                let { app = defaultCallback } = await this.config;
                if(typeof app == 'function') {
                    app = await app.call(this);
                }
                this.context.root.app = App.create(app, this.context.root);
            }
            return this.context.root.app;
        });
    }
};

function defaultCallback(){
    return this.initialParams._headers['x-app'] || 'main';
}
