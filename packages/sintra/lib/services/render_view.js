
import { View } from '../view.js';

export default {
    create(){
        return (...args) => View.render(this.context, ...args);
    }
};
