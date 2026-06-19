
import chalk from 'chalk';

export const registries = {};

export const AbstractRegistry = {
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
                    classes[normalizedName] = this.registry.extend(normalizedName).include({
                        meta(){
                            this.assignProps({
                                includes: [], filePaths: [], tags: [],
                                tag(name){ if(!this.tags.includes(name)) this.tags.push(name); }
                            });
                            this.include(this.mixins[normalizedName] || {});
                        }
                    });
                }
                return classes[normalizedName];
            },

            get tags(){
                return [...new Set(this.names.flatMap(name => this.for(name).tags ?? []))].sort();
            },

            namesMatching(query){
                const q = query.toLowerCase();
                return this.names.filter(name =>
                    name.toLowerCase().includes(q) ||
                    (this.for(name).tags ?? []).some(t => t.toLowerCase().includes(q))
                );
            },

            createListCommand({ noun, after } = {}){
                const registry = this;
                return {
                    meta(){
                        this.assignProps({ description: `Lists all available ${noun} in the current project.` });
                        this.hasParam('filter', { type: 'string', alias: 'arg1', optional: true, description: `Filter ${noun} by partial name or tag.` });
                    },

                    highlight(text){
                        const { filter } = this.params;
                        if(!filter) return text;
                        const q = filter.toLowerCase();
                        const lower = text.toLowerCase();
                        let out = '';
                        let i = 0;
                        while(i < text.length){
                            const j = lower.indexOf(q, i);
                            if(j === -1){
                                out += text.slice(i);
                                break;
                            }
                            out += text.slice(i, j) + chalk.underline(text.slice(j, j + q.length));
                            i = j + q.length;
                        }
                        return out;
                    },

                    run(){
                        const { filter } = this.params;
                        const names = filter ? registry.namesMatching(filter) : registry.names;
                        console.log('');
                        if(filter && names.length === 0){
                            console.log(`  No ${noun} matching '${filter}'.`);
                        } else {
                            if(filter){
                                console.log(`The following ${noun} matching '${filter}' are available:`);
                            } else {
                                console.log(`The following ${noun} are available:`);
                            }
                            console.log('');
                            names.forEach(name => {
                                const tags = [...(registry.for(name).tags ?? [])].sort();
                                const suffix = tags.length ? ` (${tags.map(t => this.highlight(t)).join(', ')})` : '';
                                console.log(`  * ${chalk.green(this.highlight(name))}${suffix}`);
                            });
                            if(!filter && registry.tags.length){
                                console.log('');
                                console.log(`Available tags: ${registry.tags.join(', ')}.`);
                            }
                        }
                        if(after){
                            console.log('');
                            after.call(this, { registry });
                        }
                        console.log('');
                    }
                };
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
