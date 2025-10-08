
export const Hookable = {
    meta(){
        this.assignProps({
            get hooks(){
                if(!this.hasOwnProperty('_hooks')){
                    this._hooks = {};
                }
                return this._hooks;
            },

            get allHooks(){
                let out = {};
                let current = this;
                while(current){
                    if(current.hooks){
                        for(const [name, callbacks] of Object.entries(current.hooks)){
                            if(!out[name]){
                                out[name] = [];
                            }
                            out[name] = [ ...callbacks, ...out[name] ];
                        }
                    }
                    current = current.parent;
                }
                return out;
            },

            on(events, callback){
                const normalizedEvents = Array.isArray(events) ? events : [events];
                for(const event of normalizedEvents){
                    if(!this.hooks[event]){
                        this.hooks[event] = [];
                    }
                    this.hooks[event].push(callback);
                }
            }
        });
    },

    async trigger(event, ...args){
        const hooks = this.constructor.allHooks;
        const callbacks = hooks[event] || [];
        for(const callback of callbacks){
            await callback.call(this, this, ...args);
        }
        return this;
    }
};
