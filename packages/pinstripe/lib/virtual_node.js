
import { Base } from './base.js';
import { unescapeHtml } from './unescape_html.js';
import { StringReader } from './string_reader.js';
import { SELF_CLOSING_TAGS, TEXT_ONLY_TAGS, DEFAULT_WIDGETS } from './constants.js';

const CloseTag = Base.extend().include({
    initialize(type){
        this.type = type;
    }
});


export const VirtualNode = Base.extend().include({
    meta(){
        this.assignProps({
            fromString(html){
                const out = new this();
                out.appendHtml(html);
                out.normalize();
                return out;
            },
        
            deserialize(o, parent = null){
                const { type, attributes, children } = typeof o == 'string' ? JSON.parse(o) : o;
                const out = new this(parent, type, attributes);
                out.children = children.map(
                    child => this.deserialize(child, this)
                );
                return out;
            }
        });
    },
    
    initialize(parent = null, type = '#fragment', attributes = {}){
        this.parent = parent;
        this.type = type;
        this.attributes = attributes;
        this.children = [];
    },

    appendNode(type, attributes = {}){
        const out = new this.constructor(this, type, attributes);
        this.children.push(out);
        return out;
    },

    appendHtml(html){
        if(!(html instanceof StringReader)){
            html = new StringReader(html);

            while(html.length > 0){
                try {
                    this.appendHtml(html);
                } catch(e){
                    if(e instanceof CloseTag){
                        //do nothing
                    } else {
                        throw e;
                    }
                }
            }

            return this;
        }
        
        while(html.length > 0){
            let matches;

            if(matches = html.match(/^[^<]+/)){
                this.appendNode('#text', {value: unescapeHtml(matches[0])})
            } else if(matches = html.match(/^<!DOCTYPE[^>]*>/i)){
                if(!this.parent){
                    this.appendNode('#doctype');
                }
            } else if(matches = html.match(/^<!--([\s\S]*?)-->/i)){
                this.appendNode('#comment', {value: matches[1]});
            } else if(matches = html.match(/^<([^>\s]+)/)){
                const type = matches[1].toLowerCase();
                const attributes = {};

                while(html.length > 0){
                    if(matches = html.match(/^\s*([\w-]+)\s*=\s*\"([^\">]*)\"/)){
                        attributes[matches[1]] = unescapeHtml(matches[2]);
                    } else if(matches = html.match(/^\s*([\w-]+)\s*=\s*\'([^\'>]*)\'/)){
                        attributes[matches[1]] = unescapeHtml(matches[2]);
                    } else if(matches = html.match(/^\s*([\w-]+)\s*=\s*([^\s>]+)/)){
                        attributes[matches[1]] = unescapeHtml(matches[2]);
                    } else if(matches = html.match(/^\s*([\w-]+)/)){
                        attributes[matches[1]] = null;
                    } else {
                        html.match(/^[^>]*>/);
                        break;
                    }
                }
                
                if(matches = type.match(/^\/(.*)/)){
                    throw new CloseTag(matches[1]);
                }

                const child = this.appendNode(type, attributes);
                
                if(SELF_CLOSING_TAGS.includes(type)){
                    // do nothing
                } else if(TEXT_ONLY_TAGS.includes(type) && (matches = html.match(new RegExp(`^([\\s\\S]*?)<\\/${type}[^>]*>`)))){
                    child.appendNode('#text', {value: matches[1]});
                } else if(TEXT_ONLY_TAGS.includes(type) && (matches = html.match(/^([\s\S]+)/))){
                    child.appendNode('#text', {value: matches[1]});
                } else {
                    try {
                        child.appendHtml(html);
                    } catch(e){
                        if(e instanceof CloseTag && e.type == type){
                            //do nothing
                        } else {
                            throw e;
                        }
                    }
                }
            } else if(matches = html.match(/^[\s\S]/)) {
                this.appendNode('#text', {value: matches[0]});
            } else {
                break;
            }
        }

    },

    normalize(){
        if(!this.parent && this.children.some(child => child.type == 'html')){
            this.children = [
                new this.constructor(this, '#doctype'),
                ...this.children.filter(child => child.type == 'html')
            ];
        }

        if(this.type == 'head'){
            const style = new this.constructor(this, 'style', {'data-widget': 'document/style'})
            this.children = [
                style,
                ...this.children
            ];
        }

        if(this.type == 'body'){
            const progressBar = new this.constructor(this, 'div', {'data-widget': 'document/progress-bar'})
            this.children = [
                progressBar,
                ...this.children
            ];
            progressBar.appendNode('div');
        }

        if(this.type == '#text'){
            this.attributes.value = this.attributes.value.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        }

        if(this.type == 'form' && this.attributes.autocomplete === undefined){
            this.attributes.autocomplete = 'off';
        }

        if(this.parent && this.parent.type == 'textarea' && this.type == '#text'){
            this.attributes.value = this.attributes.value.replace(/^\n/, '');
        }

        if(!this.attributes['data-widget']){
            const widget = DEFAULT_WIDGETS[this.type];
            if(widget){
                this.attributes['data-widget'] = widget;
            }
        }

        this.children.forEach(child => child.normalize());
    },

    serialize(){
        return JSON.stringify(this, ['type', 'attributes', 'children']);
    }
});

