
import * as actions  from './internal/actions.client.js';

export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);
        const { action = 'load', event = 'init' } = this.data;
        if(!action) return;
        this.on(event, (event, ...args) => {
            event.preventDefault();
            event.stopPropagation();
            const fn = actions[action];
            if(typeof fn !== 'function'){
                console.error(`No such action '${action}' exists.`);
                return;
            }
            fn.call(this, event, ...args);
        });
    }
};
