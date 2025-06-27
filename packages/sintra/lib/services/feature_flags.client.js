
let cache;

export default {
    create(){
        if(this.isClient) return this.defer(async () => {
            if(!this.context.root.hasOwnProperty('featureFlags')){
                if(!cache) cache = fetch('/_sintra/_shell/services/feature_flags.json').then(response => response.json());
                this.context.root.featureFlags = await cache
            }
            return this.context.root.featureFlags;
        });
        return this.defer(async () => {
            if(!this.context.root.hasOwnProperty('featureFlags')){
                let { featureFlags = defaultCallback } = await this.config;
                if(typeof featureFlags == 'function') {
                    featureFlags = await featureFlags.call(this);
                }
                this.context.root.featureFlags = featureFlags;
            }
            return this.context.root.featureFlags;
        });
    }
};

function defaultCallback(){
    let out = this.initialParams._headers['x-feature-flags'] || '';
    out = out.split(/\s+/).filter(name => !!name);
    return out.reduce((out, name) => ({ ...out, [name]: true }), {});
}
