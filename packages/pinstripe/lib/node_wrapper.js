
import { Base } from './base.js';
import { Registrable, initializeRegistries } from './registrable.js';
import { dasherize, camelize } from './inflector.js';
import { VirtualNode } from './virtual_node.js';
import { EventWrapper } from './event_wrapper.js';
import { overload } from './overload.js';
import { TEXT_ONLY_TAGS } from './constants.js';
import { addFileToClient } from './client.js'; // pinstripe-if-client: const addFileToClient = () => {};

export const NodeWrapper = Base.extend().include({
    meta(){
        this.include(Registrable);

        const { register } = this;
        this.assignProps({
            register(name){
                return register.call(this, dasherize(name));
            },

            instanceFor(node){
                if(!node._nodeWrapper){
                    initializeRegistries();
                    node._nodeWrapper = NodeWrapper.new(node, true);
                    const widget = node._nodeWrapper.type == '#document' ? 'internal/document' : node._nodeWrapper.data.widget;
                    if(widget){
                        node._nodeWrapper = NodeWrapper.create(widget, node);
                    } else {
                        node._nodeWrapper = NodeWrapper.new(node);
                    }
                    node._nodeWrapper.trigger('init', { bubbles: false });
                }
                return node._nodeWrapper;
            },

            actions: {}
        });
    },

    initialize(node, skipInit = false){
        this.node = node;
        this._registeredEventListeners = [];
        this._registeredTimers = [];
        this._virtualNodeFilters = [];

        if(skipInit){
            return;
        }

        this.addVirtualNodeFilter(function(){
            this.traverse(normalizeVirtualNode);
        });

        const { autosubmit } = this.data;
        if(autosubmit){
            let hash = JSON.stringify(this.values);
            this.setInterval(() => {
                const newHash = JSON.stringify(this.values);
                if(hash != newHash){
                    hash = newHash;
                    this.trigger('submit');
                }
            }, 100);
        }
    },

    get type(){
        return this.node instanceof DocumentType ? '#doctype' : this.node.nodeName.toLowerCase();
    },

    get attributes(){
        const out = {}
        if(this.node.attributes){
            for(let i = 0; i < this.node.attributes.length; i++){
                out[this.node.attributes[i].name] = this.node.attributes[i].value;
            }
        }
        return out;
    },

    get data(){
        const { attributes } = this;
        const out = {};
        Object.keys(attributes).forEach(name => {
            const matches = name.match(/^data-(.+)$/);
            if(!matches){
                return;
            }
            const value = attributes[name];
            const mappedName = camelize(matches[1]);
            try {
                out[mappedName] = JSON.parse(value);
            } catch(e){
                out[mappedName] = value;
            }
        })
        return out;
    },

    get text(){
        return this.node.textContent;
    },

    get realParent(){
        return this.node.parentNode ? this.constructor.instanceFor(this.node.parentNode) : null;
    },

    get parent(){
        return this._parent ? this._parent : this.realParent;
    },

    get parents(){
        const out = []
        let current = this
        while(current){
            current = current.parent;
            if(current){
                out.push(current);
            }
        }
        return out;
    },

    get children(){
        return [...this.node.childNodes].map(
            node => this.constructor.instanceFor(node)
        );
    },

    get siblings(){
        if(this.parent){
            return this.parent.children;
        } else {
            return [this];
        }
    },

    get previousSibling(){
        if(this.node.previousSibling){
            return this.constructor.instanceFor(this.node.previousSibling);
        } else {
            return null;
        }
    },

    get nextSibling(){
        if(this.node.nextSibling){
            return this.constructor.instanceFor(this.node.nextSibling);
        } else {
            return null;
        }
    },

    get nextSiblings(){
        const out = []
        let current = this
        while(current.nextSibling){
            current = current.nextSibling;
            out.push(current);
        }
        return out;
    },

    get previousSiblings(){
        const out = []
        let current = this
        while(current.previousSibling){
            current = current.previousSibling;
            out.push(current);
        }
        return out;
    },

    get descendants(){
        const out = this.children;
        for(let i = 0; i < out.length; i++){
            out.push(...out[i].children);
        }
        return out;
    },

    get isInput(){
        return this.is('input, textarea');
    },

    get name(){
        return this.attributes.name;
    },
    
    get value(){
        if(this.is('input[type="file"]')){
            return this.node.files[0];
        }
        if(this.is('input[type="checkbox"], input[type="radio"]')){
            return this.is(':checked') ? this.node.value : undefined;
        }
        return this.node.value;
    },

    set value(value){
        this.node.value = value;
    },

    get selectionStart(){
        return this.node.selectionStart || 0;
    },

    get selectionEnd(){
        return this.node.selectionEnd || 0;
    },

    set selectionStart(position){
        this.node.selectionStart = position;
    },

    set selectionEnd(position){
        this.node.selectionEnd = position;
    },

    get inputs(){
        return this.descendants.filter((descendant) => descendant.isInput);
    },

    get values(){
        const out = {}
        this.inputs.forEach(input => {
            const value = input.value
            if(value !== undefined){
                out[input.name] = value
            }
        })
        return out;
    },

    focus(){
        this.node.focus();
        return this;
    },

    is(selector){
        if(typeof selector == 'function'){
            return selector.call(this, this)
        }
        return (this.node.matches || this.node.matchesSelector || this.node.msMatchesSelector || this.node.mozMatchesSelector || this.node.webkitMatchesSelector || this.node.oMatchesSelector || (() => false)).call(this.node, selector);
    },

    on(name, ...args){
        const fn = args.pop()
        const selector = args.pop()

        const wrapperFn = (event, ...args) => {
            const eventWrapper = EventWrapper.instanceFor(event)
            if(selector){
                if(eventWrapper.target.is(selector)){
                    return fn.call(eventWrapper.target, eventWrapper, ...args);
                }
            } else {
                return fn.call(this, eventWrapper, ...args);
            }
        }

        this.node.addEventListener(name, wrapperFn);

        this._registeredEventListeners.push([name, wrapperFn]);

        return this;
    },
    
    trigger(name, options = {}){
        let event;

        const { data, bubbles = true, cancelable = true } = options;

        if (window.CustomEvent && typeof window.CustomEvent === 'function') {
            event = new CustomEvent(name, { bubbles, cancelable, detail: data } );
        } else {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(name, bubbles, cancelable, data);
        }
        
        this.node.dispatchEvent(event);

        return this;
    },

    setTimeout(...args){
        const out = setTimeout(...args);
        this._registeredTimers.push(out);
        return out;
    },

    setInterval(...args){
        const out = setInterval(...args);
        this._registeredTimers.push(out);
        return out;
    },

    remove(){
        if(this.type != '#doctype'){
            clearTimers.call(this);
            this.realParent.node.removeChild(this.node);
        }
        return this;
    },

    addClass(name){
        this.node.classList.add(name);
        return this;
    },

    removeClass(name){
        this.node.classList.remove(name);
        return this;
    },

    patch: overload({
        string(html){
            cleanChildren.call(this);
            if(TEXT_ONLY_TAGS.includes(this.type)){
                insert.call(this, { type: '#text', attributes: { value: html }, children: [] });
            } else {
                patchChildren.call(this, createVirtualNode.call(this, html).children);
            }
            initChildren.call(this);
            return this.children;
        },

        object(attributes){
            patchAttributes.call(this, attributes);
            return this;
        }
    }),

    append(html){
        return prepend.call(this, html);
    },

    prepend(html){
        return prepend.call(this, html, this.children[0]);
    },

    insertBefore(html){
        return prepend.call(this.realParent, html, this);
    },

    insertAfter(html){
        return prepend.call(this.realParent, html, this.nextSibling);
    },

    addVirtualNodeFilter(fn){
        this._virtualNodeFilters.push(fn);
        return this;
    }
});

function cleanChildren(){
    this.children.forEach(child => clean.call(child));
}

function clean(){
    if(this.is('*[data-widget="internal/progress-bar"]')){
        return;
    }

    [...this.node.childNodes].forEach(node => node._nodeWrapper && clean.call(node._nodeWrapper));

    while(this._registeredEventListeners.length){
        this.node.removeEventListener(...this._registeredEventListeners.pop());
    }

    clearTimers.call(this);

    this.node._nodeWrapper = undefined;
}

function clearTimers(){
    while(this._registeredTimers.length){
        clearTimeout(this._registeredTimers.pop());
    }
}

function initChildren(){
    this.children.forEach(child => initChildren.call(child));
}

function prepend(html, referenceChild){
    const out = [];
    if(TEXT_ONLY_TAGS.includes(this.type)){
        out.push(insert.call(this, { type: '#text', attributes: { value: html }, children: [] }, referenceChild));
    } else {
        createVirtualNode.call(this, html).children.forEach((virtualChild) => {
            out.push(insert.call(this, virtualChild, referenceChild));
        });
    }
    return out;
}

function createVirtualNode(html){
    const out = VirtualNode.fromString(html);
    this._virtualNodeFilters.forEach(filter => filter.call(out, out));
    return out;
}

function patch(attributes, virtualChildren){
    if(this.is('*[data-widget="internal/progress-bar"]')){
        return;
    }
    patchAttributes.call(this, attributes);
    patchChildren.call(this, virtualChildren);
}

function patchAttributes(attributes){
    if(this.type == '#text' || this.type == '#comment'){
        if(this.node.textContent != attributes.value){
            this.node.textContent = attributes.value;
        }
    } else if(this.type != '#doctype'){
        const currentAttributes = this.attributes;
        Object.keys(currentAttributes).forEach((key) => {
            if(attributes[key] === undefined){
                this.node.removeAttribute(key);
            }
        })
        Object.keys(attributes).forEach((key) => {
            if(currentAttributes[key] != attributes[key]){
                this.node.setAttribute(key, attributes[key]);
                if(key == 'value'){
                    this.node.value = attributes[key];
                }
            }
        })
    }
}

function patchChildren(virtualChildren){
    const children = [...this.node.childNodes].map(
        node => NodeWrapper.new(node, true)
    );

    for(let i = 0; i < virtualChildren.length; i++){
        let child = children[0];
        const virtualChild = virtualChildren[i];

        if(child && child.type == virtualChild.type){
            patch.call(children.shift(), virtualChild.attributes, virtualChild.children);
        } else if(virtualChild.type == '#doctype'){
            // ignore
        } else if(virtualChild.type.match(/^#(text|comment)/)){
            insert.call(this, virtualChild, child);
        } else {
            while(children.length > 0 && children[0].type.match(/^#/)){
                children.shift().remove();
            }
            child = children[0]
            if(child && child.type == virtualChild.type){
                patch.call(children.shift(), virtualChild.attributes, virtualChild.children);
            } else {
                insert.call(this, virtualChild, child);
            }
        }
    }

    while(children.length > 0){
        children.shift().remove();
    }
}

function insert(virtualNode, referenceChild, returnNodeWrapper = true){
    const { type, attributes, children } = virtualNode;

    let node;

    if(type == '#text'){
        node = document.createTextNode(attributes.value);
    } else if(type == '#comment'){
        node = document.createComment(attributes.value);
    } else {
        node = document.createElement(type);
        Object.keys(attributes).forEach((key) => {
            node.setAttribute(key, attributes[key]);
        });
    }

    children.forEach(child => {
        insert.call(NodeWrapper.new(node, true), child, null, false);
    })
    
    this.node.insertBefore(
        node,
        referenceChild && referenceChild.node
    );
    
    if(returnNodeWrapper){
        return NodeWrapper.instanceFor(node);
    }
}

function normalizeVirtualNode(){
    if(!this.parent && this.children.some(child => child.type == 'html')){
        this.children = [
            new this.constructor(this, '#doctype'),
            ...this.children.filter(child => child.type == 'html')
        ];
    }

    if(this.type == 'body'){
        const progressBar = new this.constructor(this, 'div', {'data-widget': 'internal/progress-bar'})
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
}

EventWrapper.NodeWrapper = NodeWrapper;

export const defineWidget = overload({
    ['string, object'](name, include){
        const abstract = include.abstract;
        delete include.abstract;
        NodeWrapper.register(name, abstract).include(include);
    }
});


export const widgetImporter = dirPath => {
    const files = [];

    addFileToClient(`${dirPath}/_importer.client.js`, () => {
        const filteredFiles = files.filter(({ filePath }) => filePath.match(/\.client\.js$/));

        return `
            import { defineWidget } from 'pinstripe';

            ${filteredFiles.map(({ filePath, relativeFilePathWithoutExtension }, i) => {
                const importName = `definition${i + 1}`;

                return `
                    import ${importName} from ${JSON.stringify(filePath)};
                    defineWidget(${JSON.stringify(relativeFilePathWithoutExtension)}, ${importName});
                `;
            }).join('')}
        `;
    });

    return async filePath => {
        const relativeFilePath = filePath.substr(dirPath.length).replace(/^\//, '');

        if(filePath.match(/\.js$/)){
            const relativeFilePathWithoutExtension = relativeFilePath.replace(/\.[^/]+$/, '');
            if(relativeFilePathWithoutExtension == '_importer'){
                return;
            }
            addFileToClient(filePath);
            const definition = await ( await import(filePath) ).default;
            if(definition !== undefined){
                files.push({ filePath, relativeFilePathWithoutExtension });
                defineWidget(relativeFilePathWithoutExtension, definition);
            }
            return;
        }
    };
};

