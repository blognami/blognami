
import { Class } from './class.js';

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
            },

            get FileImporter(){
                if(!this.registry.hasOwnProperty('_FileImporter')){
                    this.registry._FileImporter = Class.extend().include({
                        meta(){
                            this.include(Registry);
                            
                            this.assignProps({
                                async importFile({ dirPath, filePath }){
                                    if(filePath.match(/\/_file_importer\.js$/)) return;
                                    const matches = filePath.match(/^.*?\.([^/]+)$/);
                                    if(!matches) return;
                                    const extension = matches[1].split('.');
                                    while(extension.length > 0){
                                        const candidateExtension = extension.join('.');
                                        if(this.mixins[candidateExtension]){
                                            await this.create(candidateExtension, { dirPath, filePath }).importFile();
                                            return;
                                        }
                                        extension.shift();
                                    }
                                    await this.create(matches[1], { dirPath, filePath }).importFile();
                                }
                            });
                        },

                        initialize({ dirPath, filePath }){
                            const relativeFilePath = filePath.substring(dirPath.length + 1);

                            const regExpEscapedExtension = this.constructor.name.replace(/\./g, '\\.')

                            this.assignProps({ 
                                dirPath,
                                filePath,
                                relativeFilePath: relativeFilePath,
                                relativeFilePathWithoutExtension: relativeFilePath.replace(RegExp(`\.${regExpEscapedExtension}$`), ''),
                                isExactMatch: !RegExp(`\\.[^\/]+\\.${regExpEscapedExtension}$`).test(filePath)
                            });
                        },

                        importFile(){
                            // by default do nothing
                        }
                    });

                    const that = this;
                    this.registry._FileImporter.register('js', {
                        async importFile(){
                            if(!this.isExactMatch) return;

                            const { default: _default } = await import(this.filePath);
                            if(!_default) return;

                            const { filePath } = this;

                            that.register(this.relativeFilePathWithoutExtension, {
                                meta(){
                                    this.filePaths.push(filePath);
                                    this.include(_default);
                                }
                            });
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
