
import { Markdown } from '../markdown.js';

const client = {
    create(){
        return markdown => Markdown.render(markdown);
    }
};

export default client;