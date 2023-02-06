
import { Class } from './class.js';

export const Registry = {
    meta(){

        const { include } = this;

        let classes = {};

        this.assignProps({
            registry: this,

            mixins: {},

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
                classes = {};
            },

            unregister(name){
                const normalizedName = this.normalizeName(name);
                delete this.mixins[normalizedName];
            },

            clearCachedClasses(){
                classes = {};
            },

            createInitialMixin(name){
                return {};
            },

            for(name){
                const normalizedName = this.normalizeName(name);
                if(!classes[normalizedName]){
                    classes[normalizedName] = this.registry.extend().include({
                        meta(){
                            this.assignProps({ name: normalizedName, includes: [] });
                            this.include(this.createInitialMixin(normalizedName));
                            this.include(this.mixins[normalizedName] || {});
                        }
                    });
                }
                return classes[normalizedName];
            },

            reset(){
                classes = {};
                this.initialize();
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
            },

            get FileImporter(){
                if(!this.registry.hasOwnProperty('_FileImporter')){
                    this.registry._FileImporter = Class.extend().include({
                        meta(){
                            this.include(Registry);
                            
                            this.assignProps({
                                async importFile({ extension, ...rest }){
                                    await this.create(extension).importFile({ extension, ...rest });
                                }
                            });
                        },

                        importFile(){
                            // by default do nothing
                        }
                    });

                    const that = this;
                    this.registry._FileImporter.register('js', {
                        async importFile({ filePath, relativeFilePathWithoutExtension }){
                            if(relativeFilePathWithoutExtension == '_file_importer') return;
                            const include = (await import(filePath)).default;
                            if(!include) return;
                            that.register(relativeFilePathWithoutExtension, include);
                        }
                    });
                }
                return this.registry._FileImporter;
            },

            async importFile(...args){
                await this.FileImporter.importFile(...args);
            }
        })
    }
};
