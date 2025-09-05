
import { Markdown } from '../markdown.js';

export default{
    create(){
        return (...args) => Markdown.render(...args);
    }
};
