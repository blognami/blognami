
import { App } from '../app.js';

export const client = true;

export default {
    create(){
        if(!this.context.root.hasOwnProperty('app')){
            this.context.root.app = App.create(this.initialParams._headers['x-app'] || 'main', this.context.root);
        }
        return this.context.root.app;
    }
};
