
let cache;

export default {
    meta(){
        this.addToClient();
    },
    
    create(){
        if(this.isClient) return this.defer(async () => {
            return this.context.root.getOrCreate('environment', async () => {
                if(!cache) cache = fetch('/_pinstripe/_shell/environment.json').then(response => response.json());
                return await cache;
            });
        });
        return this.defer(async () => {
            if(!cache){
                cache = process.env.NODE_ENV ?? 'development';
            }
            return cache;
        });
    }
};

