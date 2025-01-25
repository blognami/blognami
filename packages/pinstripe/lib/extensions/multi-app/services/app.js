
export default {
    async create(){
        if(!this.context.root.app) {
            let { app = defaultCallback } = await this.config;
            if(typeof app == 'function') {
                app = await app.call(this);
            }
            this.context.root.app = app;
        }
        return this.context.root.app;
    }
    
};

function defaultCallback(){
    return this.initialParams._headers['x-app'] || 'main';
}