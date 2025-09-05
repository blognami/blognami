
export const registries = {};

export const Registry = {
    meta(){
        registries[this.name] = this;

        const { include } = this;

        this.assignProps({
            registry: this,

            mixins: {},

            cache: {},

            get names(){
                return Object.keys(this.mixins).sort();
            },
        
            get includedIn(){
                const out = [];
                this.names.forEach(name => {
                    if(this.for(name).includes.includes(this.name) && !out.includes(name)){
                        out.push(name);
                    }
                });
                return out;
            },

            normalizeName(name){
                return name;
            },

            normalizeMixin(name, mixin, previousMixin){
                return {
                    meta(){
                        if(previousMixin) this.include(previousMixin);
                        this.include(mixin);
                    }
                }
            },

            register(name, mixin = {}){
                const normalizedName = this.normalizeName(name);
                this.mixins[normalizedName] = this.normalizeMixin(normalizedName, mixin, this.mixins[normalizedName]);
                this.clearCache();
            },

            unregister(name){
                const normalizedName = this.normalizeName(name);
                delete this.mixins[normalizedName];
                this.clearCache();
            },

            clearCache(){
                this.registry.cache = {};
            },

            warmCache(){
                this.names.forEach(name => this.for(name));
            },

            for(name){
                const normalizedName = this.normalizeName(name);
                if(!this.cache.classes) this.cache.classes = {};
                const { classes } = this.cache;
                if(!classes[normalizedName]){
                    classes[normalizedName] = this.registry.extend().include({
                        meta(){
                            this.assignProps({ name: normalizedName, includes: [], filePaths: [] });
                            this.include(this.mixins[normalizedName] || {});
                        }
                    });
                }
                return classes[normalizedName];
            },

            include(...includes){
                includes.forEach(current => {
                    if(typeof current == 'string'){
                        if(!this.mixins[current]) throw new Error(`Named include '${current}' does not exist.`);
                        if(!this.includes.includes(current)) this.includes.push(current);
                        return include.call(this, this.mixins[current]);
                    }
                    return include.call(this, current);
                });
                return this;
            },
            
            create(name, ...args){
                return this.for(name).new(...args);
            }
        })
    }
};
