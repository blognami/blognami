
import { Markdown } from '../markdown.js';

export default{
    meta(){
        this.addToClient();
    },
    
    create(){
        return (...args) => Markdown.render(...args);
    }
};
