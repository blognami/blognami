
import { Markdown } from '../markdown.js';

export default {
    create(){
        return markdown => Markdown.render(markdown);
    }
};

