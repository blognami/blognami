
export const Hookable = {
    meta(){
        this.assignProps({
            get hooks(){
                if(!this.hasOwnProperty('_hooks')){
                    this._hooks = {};
                }
                return this._hooks;
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
        const callbacks = this.constructor.hooks[event] || [];
        for(const callback of callbacks){
            await callback.call(this, this, ...args);
        }
        return this;
    }
};
