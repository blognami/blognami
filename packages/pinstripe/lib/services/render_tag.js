import { SELF_CLOSING_TAGS } from '../constants.js';

export default {
    create(){
        return (...args) => {
            const [defaultTagName, attributes = {}] = typeof args[0] === 'string' ? args : ['div', args[0]];
            const { tagName = defaultTagName, body, ...otherAttributes } = attributes;
            const normalizedTagName = tagName.toLowerCase();
            const out = [];
            out.push(this.renderHtml(`<${normalizedTagName}`));
            for(const [key, value] of Object.entries(otherAttributes)){
                if(value === true){
                    out.push(this.renderHtml` ${key}`);
                } else if(value != undefined) {
                    out.push(this.renderHtml` ${key}="${value}"`);
                }
            }
            out.push(this.renderHtml`>`);
            if(!SELF_CLOSING_TAGS.includes(normalizedTagName)){
                if(body) out.push(body);
                out.push(this.renderHtml`</${normalizedTagName}>`);
            }
            return this.renderHtml`${out}`;
        };
    }
};