
import { load }  from './actions.client.js';

export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);
        this.on('submit', (event, ...args) => {
            event.preventDefault();
            event.stopPropagation();
            load.call(this, event, ...args);
        });
    }
};
