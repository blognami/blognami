
export const Registrable = {
    meta(){
        const { include } = this;

        this.assignProps({
            classes: {},

            get includes(){
                if(!this.hasOwnProperty('includes')){
                    this._includes = [];
                }
                return this._includes;
            },

            include(...args){
                args.forEach(arg => {
                    if(this.abstract){
                        this.includes.push(...args);
                    } else if(typeof arg == 'string'){
                        this.include(...this.for(arg).includes);
                    } else {
                        include.call(this, arg);
                    }
                });
                return this;
            },
        
            register(name){
                if(!this.classes[name]){
                    this.classes[name] = this.extend().assignProps({
                        get name(){
                            return name;
                        }
                    });
                }
                return this.classes[name];
            },
        
            unregister(name){
                delete this.classes[name];
                return this;
            },
        
            for(name){
                return this.classes[name] || this.extend().assignProps({
                    get name(){
                        return name;
                    }
                });
            },
        
            create(name, ...args){
                return new (this.for(name))(...args);
            }
        });
    }
};
