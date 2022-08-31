
import { unescapeHtml } from './unescape_html.js';
import { StringReader } from './string_reader.js';
import { SELF_CLOSING_TAGS, TEXT_ONLY_TAGS } from './constants.js';

class CloseTag {
    constructor(type){
        this.type = type;
    }
}

export class VirtualNode {

    static fromString(html){
        const out = new this();
        out.appendHtml(html);
        return out;
    }

    static deserialize(o, parent = null){
        const { type, attributes, children } = typeof o == 'string' ? JSON.parse(o) : o;
        const out = new this(parent, type, attributes);
        out.children = children.map(
            child => this.deserialize(child, this)
        );
        return out;
    }

    constructor(parent = null, type = '#fragment', attributes = {}){
        this.parent = parent;
        this.type = type;
        this.attributes = attributes;
        this.children = [];
    }

    get text(){
        const out = [];
        this.traverse(node => {
            if(node.type == '#text'){
                out.push(node.attributes.value);
            }
        });
        return out.join('');
    }

    appendNode(type, attributes = {}){
        const out = new this.constructor(this, type, attributes);
        this.children.push(out);
        return out;
    }

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

    }

    traverse(fn){
        fn.call(this, this);
        this.children.forEach(child => child.traverse(fn));
    }

    serialize(){
        return JSON.stringify(this, ['type', 'attributes', 'children']);
    }

    toString(){
        if(this.type == '#doctype') return '<!DOCTYPE html>';
        if(this.type == '#text'){
            if(this.parent && TEXT_ONLY_TAGS.includes(this.parent.type)) return this.attributes.value;
            return escapeHtml(this.attributes.value);
        }
        if(this.type == '#comment') return `<!--${escapeHtml(this.attributes.value)}-->`;
        const out = [];
        if(this.type != '#fragment'){
            out.push(`<${this.type}`);
            Object.keys(this.attributes).forEach(name => {
                const value = this.attributes[name];
                if(value){
                    out.push(` ${name}="${escapeHtml(value)}"`);
                } else {
                    out.push(` ${name}`);
                }
            })
            out.push('>');
        }
        this.children.forEach(child => {
            out.push(child.toString());
        });
        if(this.type != '#fragment' && !SELF_CLOSING_TAGS.includes(this.type)) out.push(`</${this.type}>`);
        return out.join('');
    }
}

const escapeHtml = html => html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");

export const parseHtml = html => VirtualNode.fromString(html);
