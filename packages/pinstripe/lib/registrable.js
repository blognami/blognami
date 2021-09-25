
let registriesInitialized = false;

const registries = [];

export const Registrable = {
    meta(){
        const Registry = this;
        registries.push(Registry);

        const { include } = this;

        this.assignProps({
            classes: {},

            get includes(){
                if(!this.hasOwnProperty('_includes')){
                    this._includes = [];
                }
                return this._includes;
            },

            include(...args){
                args.forEach(arg => {
                    if(this.abstract || (this.prototype instanceof Registry && !registriesInitialized)){
                        this.includes.push(arg);
                        return;
                    }
                    if(typeof arg == 'string'){
                        this.include(...this.for(arg).includes);
                    } else {
                        include.call(this, arg);
                    }
                });

                return this;
            },
        
            register(name, abstract = false){
                if(!this.classes[name]){
                    this.classes[name] = createClass.call(this, name, abstract);
                }
                return this.classes[name];
            },
        
            unregister(name){
                delete this.classes[name];
                return this;
            },
        
            for(name){
                return this.classes[name] || createClass.call(this, name, false);
            },
        
            create(name, ...args){
                initializeRegistries();
                return new (this.for(name))(...args);
            }
        });
    }
};

function createClass(name, abstract){
    return this.extend().assignProps({
        get abstract(){
            return abstract;
        },

        get name(){
            return name;
        }
    });
}

export const initializeRegistries = () => {
    if(!registriesInitialized){
        registriesInitialized = true;
        registries.forEach(Registry => { 
            Object.keys(Registry.classes).forEach(name => {
                const Class = Registry.classes[name];
                Class.include(...Class.includes);
            });
        });
    }
};
