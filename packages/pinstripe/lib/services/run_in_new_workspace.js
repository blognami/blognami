
import { Workspace } from '../workspace.js';

export default {
    meta(){
        this.addToClient();
    },

    create(){
        return fn => {
            const { initialParams } = this;
            return Workspace.run(function(){
                Object.assign(this.initialParams, initialParams);
                return fn.call(this, this);
            });
        };
    }
};
