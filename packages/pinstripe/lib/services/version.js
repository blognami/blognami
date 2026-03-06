
let cache;

export default {
    meta(){
        this.addToClient();
    },
    
    create(){
        if(this.isClient) return this.defer(async () => {
            return this.context.root.getOrCreate('version', async () => {
                if(!cache) cache = fetch('/_pinstripe/_shell/version.json').then(response => response.json());
                return await cache;
            });
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

