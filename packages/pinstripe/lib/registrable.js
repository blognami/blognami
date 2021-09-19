
export const Registrable = {
    meta(){
        this.staticProps({
            classes: {},
        
            register(name){
                if(!this.classes[name]){
                    this.classes[name] = this.extend().staticProps({
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
                return this.classes[name] || this.extend().staticProps({
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
