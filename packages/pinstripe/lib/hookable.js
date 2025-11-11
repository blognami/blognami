
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

            addHook(names, callback){
                const normalizedEvents = Array.isArray(names) ? names : [names];
                const normalizedCallback = typeof callback === 'function' ? callback : function(...args){
                    return this[callback](...args);
                };
                for(const name of normalizedEvents){
                    if(!this.hooks[name]){
                        this.hooks[name] = [];
                    }
                    this.hooks[name].push(normalizedCallback);
                }
            }
        });
    },

    async runHook(name, options = {}){
        const {
            args = [],
            stopIf = () => false,
            beforeEach = undefined,
            betweenEach = undefined,
            afterEach = undefined,
            ifNone = undefined,
            filter = () => true,
            sort = (a, b) => {
                const aOrder = (typeof a === 'object' && a !== null && 'displayOrder' in a) ? a.displayOrder : 100;
                const bOrder = (typeof b === 'object' && b !== null && 'displayOrder' in b) ? b.displayOrder : 100;
                return aOrder - bOrder;
            }
        } = options;

        const out = [];
        const hooks = this.constructor.allHooks;
        const callbacks = hooks[name] || [];
        for(const callback of callbacks){
            if(typeof beforeEach === 'function') await beforeEach.call(this, ...args);
            if(out.length > 0 && typeof betweenEach === 'function') out.push(await betweenEach.call(this, ...args));
            const item = await callback.call(this, ...args);
            out.push(item);
            if(typeof afterEach === 'function') await afterEach.call(this, ...args);
            if(await stopIf(item)) break;
        }

        if(out.length === 0 && typeof ifNone === 'function'){
            out.push(await ifNone.call(this, ...args));
        }

        return out.filter(filter).sort(sort);
    }
};
