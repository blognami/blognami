
import { View } from '../view.js';

export const client = true;

export default {
    create(){
        return async (name, params = {}) => {
            const viewMap = await this.viewMap;
            const mappedName = viewMap[name];
            if(!mappedName) return;
            return View.render(this.context, mappedName, params);
        }
    }
};
