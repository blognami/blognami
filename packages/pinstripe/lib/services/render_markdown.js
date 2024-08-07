
import { Markdown } from '../markdown.js';

export const client = true;

export default{
    create(){
        return (...args) => Markdown.render(...args);
    }
};
