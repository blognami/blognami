
export const Hookable = {
    meta(){

        const { include } = this;

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

            addHook(events, callback){
                const normalizedEvents = Array.isArray(events) ? events : [events];
                for(const event of normalizedEvents){
                    if(!this.hooks[event]){
                        this.hooks[event] = [];
                    }
                    this.hooks[event].push(callback);
                }
            },

            include(...includes){
                const out = include.call(this, ...includes);
                for(const include of includes){
                    for(const name in include){
                        const matches = name.match(/^(.+?)__.+$/);
                        if(!matches) continue;
                        this.addHook(matches[1], function(...args){
                            return this[name](...args);
                        });
                    }
                }
                return out;
            }
        });
    },

    async runHook(event, ...args){
        let out = [];
        const hooks = this.constructor.allHooks;
        const callbacks = hooks[event] || [];
        for(const callback of callbacks){
            out.push(await callback.call(this, this, ...args));
        }
        out.sort((a, b) => {
            const aOrder = (typeof a === 'object' && a !== null && 'displayOrder' in a) ? a.displayOrder : 100;
            const bOrder = (typeof b === 'object' && b !== null && 'displayOrder' in b) ? b.displayOrder : 100;
            return aOrder - bOrder;
        });
        return out;
    }
};
