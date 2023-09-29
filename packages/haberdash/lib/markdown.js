

import MarkdownIt from 'markdown-it';

import { Class } from './class.js';
import { parseHtml } from './virtual_node.js';
import { Html } from './html.js';

export const Markdown = Class.extend().include({
    meta(){
        this.assignProps({
            render(value){
                return this.new(value).render();
            }
        });
    },

    initialize(value){
        this.value = value;
    },

    render(){
        const html = new MarkdownIt().use(injectLineNumbers).render(this.value || '');
        const virtualNode = parseHtml(html);
        virtualNode.children.forEach(paragraph => {
            if(paragraph.type != 'p') return;
            const text = paragraph.children[0];
            if(!text || text.type != '#text') return;
            const { value } = text.attributes;
            const matches = value.match(/^\/([^\/\s]*)(.*)$/);
            if(!matches){
                delete paragraph.attributes['data-line-number'];
                return
            };
            const name = matches[1];
            const args = matches[2].trim();

            paragraph.type = 'div';
            paragraph.attributes = {
                ...paragraph.attributes,
                'data-component': 'pinstripe-frame',
                'data-url': `/blocks/${name}?args=${encodeURIComponent(args)}`,
            };
            paragraph.children = [];
        });
        return Html.new(virtualNode.toString());
    }
});

const injectLineNumbers = (md) => {
    md.renderer.rules.paragraph_open = (tokens, idx, options, env, slf) => {
        if (tokens[idx].map) {
            const line = tokens[idx].map[0];
            tokens[idx].attrSet('data-line-number', `${line + 1}`);
        }
        return slf.renderToken(tokens, idx, options, env, slf);
    }
};