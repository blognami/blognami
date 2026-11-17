export const NOT_BUILT_MESSAGE = 'Static assets are not built: run "blognami bundle-static-assets" or install @blognami/bundler';

export default {
    create(){
        return this.defer(() => this);
    },

    async build(){
        throw new Error(NOT_BUILT_MESSAGE);
    }
};
