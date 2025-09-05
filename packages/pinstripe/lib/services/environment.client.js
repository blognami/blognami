
let cache;

export default {
    create(){
        if(this.isClient) return this.defer(async () => {
            if(!this.context.root.hasOwnProperty('environment')){
                if(!cache) cache = fetch('/_pinstripe/_shell/environment.json').then(response => response.json());
                this.context.root.environment = await cache
            }
            return this.context.root.environment;
        });
        return this.defer(async () => {
            if(!cache){
                cache = process.env.NODE_ENV ?? 'development';
            }
            return cache;
        });
    }
};

