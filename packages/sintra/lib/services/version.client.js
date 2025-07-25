
let cache;

export default {
    create(){
        if(this.isClient) return this.defer(async () => {
            if(!this.context.root.hasOwnProperty('version')){
                if(!cache) cache = fetch('/_sintra/_shell/services/version.json').then(response => response.json());
                this.context.root.version = await cache
            }
            return this.context.root.version;
        });
        return this.defer(async () => {
            if(!cache){
                cache = await this.project.config.version || '0.1.0';
                if(await this.environment == 'development'){
                    cache += `.${Date.now()}`;
                }
            }
            return cache;
        });
    }
};

