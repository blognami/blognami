
export default {
    create(){
        const context = this.context;
        return {
            intercept(name, fn){
                context._serviceInterceptors ??= {};
                context._serviceInterceptors[name] = fn;
            }
        };
    }
};
