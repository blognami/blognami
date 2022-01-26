
import MarkdownIt from 'markdown-it';

import { VirtualNode } from '../virtual_node.js';

export default ({ renderHtml }) => {
    return markdown => {
        const html = new MarkdownIt().use(injectLineNumbers).render(markdown || '');
        const virtualNode = VirtualNode.fromString(html);
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
                class: 'frame',
                'data-url': `/blocks/${name}?args=${encodeURIComponent(args)}`
            };
            paragraph.children = [];
        })
        return renderHtml(virtualNode.toString());
    };
};

const injectLineNumbers = (md) => {
    md.renderer.rules.paragraph_open = (tokens, idx, options, env, slf) => {
        if (tokens[idx].map) {
            const line = tokens[idx].map[0];
            tokens[idx].attrSet('data-line-number', `${line}`);
        }
        return slf.renderToken(tokens, idx, options, env, slf);
    }
}