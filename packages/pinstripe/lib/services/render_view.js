
import { View } from '../view.js';

export const client = true;

export default {
    create(){
        return (name, params = {}) => {
            const candidateIndexName = `${name}/index`;
            if(View.mixins[candidateIndexName]){
                return View.render(this.context, candidateIndexName, params);
            }
            return View.render(this.context, name, params);
        }
    }
};
