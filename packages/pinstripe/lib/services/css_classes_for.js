
import { createHash } from '../view.js';

export default {
    create(){
        return name => {
            const hash = createHash(name);
            return this.trapify({
                __getMissing: (target, name) => `view-${hash}-${this.inflector.dasherize(name)}`
            });
        };
    }
};