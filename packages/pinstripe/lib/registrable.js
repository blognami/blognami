
export const Registrable = {
    meta(){
        const { include } = this;

        this.assignProps({
            classes: {},

            include(...args){
                args.forEach(arg => {
                    if(typeof arg == 'string'){
                        this.include(this.for(arg));
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
