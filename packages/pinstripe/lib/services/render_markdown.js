
import { Markdown } from '../markdown.js';

export const client = true;

export default{
    create(){
        return markdown => Markdown.render(markdown);
    }
};
