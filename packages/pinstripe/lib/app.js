
import { Class } from './class.js';
import { Registry } from './registry.js';
import { View } from './view.js';
import { ServiceConsumer } from './service_consumer.js';

export const App = Class.extend().include({
    meta(){
        this.include(Registry);
        this.include(ServiceConsumer);
    },

    compose(){
        return [];
    },

    get viewMapper(){
        if(!this._viewMapper){
            this._viewMapper = View.mapperFor(this.compose());
        }
        return this._viewMapper;
    },

    renderView(...args){
        return this.viewMapper.renderView(this.context, ...args);
    },

    isView(...args){
        return this.viewMapper.isView(...args);
    },

    get viewNames(){
        return this.viewMapper.viewNames;
    }
});
