import { NOT_BUILT_MESSAGE } from './js_bundler.js';

export default {
    create(){
        return this.defer(() => this);
    },

    async build(){
        throw new Error(NOT_BUILT_MESSAGE);
    }
};
