

import { Class } from './class.js';
import { MarkupNode } from './markup_node.js';
import { Html } from './html.js';
import { inflector } from '@pinstripe/utils';

const headingSlug = (text) =>
    inflector.dasherize(`${text}`.toLowerCase())
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

export const Markdown = Class.extend().include({
    meta(){
        this.assignProps({
            render(value, options = {}){
                return this.new(value, options).render();
            }
        });
    },

    initialize(value, options = {}){
        const { mode = 'view', allowHtml = false } = options;
        this.value = value;
        this.mode = mode;
        this.allowHtml = allowHtml;
    },

    async render(){
        const virtualNode = await MarkupNode.fromMarkdown(this.value || '').render();

        const idCounters = {};

        virtualNode.children.forEach(heading => {
            const matches = heading.type.match(/^h([1-6])$/);
            if(!matches) return;
            const text = heading.text;
            let id = `heading-${headingSlug(text)}`;
            if(id in idCounters){
                idCounters[id]++;
                id = `${id}-${idCounters[id]}`;
            } else {
                idCounters[id] = 1;
            }
            heading.attributes.id = id;
        });

        virtualNode.children.forEach(paragraph => {
            if(paragraph.type != 'p') return;
            const text = paragraph.children[0];
            if(!text || text.type != '#text') return;
            const { value } = text.attributes;
            const matches = value.match(/^\/([^\/\s]*)(.*)$/);
            if(!matches){
                delete paragraph.attributes['data-line-number'];
                return
            }
            if(this.mode == 'view'){
                paragraph.type = '#text';
                paragraph.attributes = { value: '' };
                paragraph.children = [];
                return;
            }
            const name = matches[1];
            const args = matches[2].trim();

            paragraph.type = 'div';
            paragraph.attributes = {
                ...paragraph.attributes,
                'data-component': 'pinstripe-frame',
                'data-url': `/_markdown_slash_blocks/${name}?args=${new URLSearchParams({ args })}`,
            };
            paragraph.children = [];
        });

        if(!this.allowHtml) virtualNode.sanitize();

        return Html.new(virtualNode.toString());
    }
});