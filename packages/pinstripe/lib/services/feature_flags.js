
let cache;

export default {
    meta(){
        this.addToClient();
    },
    
    create(){
        if(this.isClient) return this.defer(async () => {
            return this.context.root.getOrCreate('featureFlags', async () => {
                if(!cache) cache = fetch('/_pinstripe/_shell/feature_flags.json').then(response => response.json());
                return await cache;
            });
        });
        return this.defer(async () => {
            return this.context.root.getOrCreate('featureFlags', async () => {
                let { featureFlags = defaultCallback } = await this.config;
                if(typeof featureFlags == 'function') {
                    featureFlags = await featureFlags.call(this);
                }
                return featureFlags;
            });
        });
    }
};

function defaultCallback(){
    let out = this.initialParams._headers['x-feature-flags'] || '';
    out = out.split(/\s+/).filter(name => !!name);
    return out.reduce((out, name) => ({ ...out, [name]: true }), {});
}
