export default {
    create(){
        return (...args) => this.defer(() => this.renderViews(...args));
    },

    async renderViews(...args){
        const lastArg = args[args.length - 1];
        const params = typeof lastArg == 'object' && !Array.isArray(lastArg) ? args.pop() : {};
        const out = [];
        for(const name of await this.matchViews(...args)){
            out.push(await this.renderView(name, params));
        }
        return out;
    }
};