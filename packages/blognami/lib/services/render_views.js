export default {
    create(){
        return (...args) => this.defer(() => this.renderViews(...args));
    },

    async renderViews(...args){
        const lastArg = args[args.length - 1];
        const params = typeof lastArg == 'object' && !Array.isArray(lastArg) ? args.pop() : {};
        return this.matchViews(...args).map(name => this.renderView(name, params));
    }
};