
import { Base } from './base.js';
import { initializeRegistries } from './registrable.js';
import { VirtualNode } from './virtual_node.js';
import { EventWrapper } from './event_wrapper.js';
import { overload } from './overload.js';
import { TEXT_ONLY_TAGS } from './constants.js';
import { Registrable } from './registrable.js';

export const NodeWrapper = Base.extend().include({
    meta(){

        this.include(Registrable);

        const { register } = this;

        this.assignProps({
            register(name, ...args){
                return register.call(this, dasherize(name),  ...args);
            },

            instanceFor(node){
                if(!node._nodeWrapper){
                    initializeRegistries();

                    node._nodeWrapper = NodeWrapper.new(node, true);

                    const { nodeWrapper = node._nodeWrapper.type == '#document' ? 'document' : undefined } = node._nodeWrapper.data;

                    if(nodeWrapper) {
                        node._nodeWrapper = this.create(nodeWrapper, node);
                    } else {
                        node._nodeWrapper = NodeWrapper.new(node);
                    }

                    node._nodeWrapper.trigger('init', { bubbles: false });
                }
                return node._nodeWrapper;
            },
        });
    },

    initialize(node, skipInit = false){
        this.node = node;
        this._registeredEventListeners = [];
        this._registeredObservers = [];
        this._registeredTimers = [];
        this._virtualNodeFilters = [];

        if(skipInit) return;

        this.addVirtualNodeFilter(function(){
            this.traverse(normalizeVirtualNode);
        });

        const { autofocus } = this.attributes;

        if(autofocus){
            this.setTimeout(() => this.node.focus());
        }

        const { autosubmit, trigger } = this.data;

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

        if(trigger){
            this.setTimeout(() => {
                this.trigger(trigger);
            }, 0);
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
        if(this.is('input[type="radio"]')){
            return this.is(':checked') ? this.node.value : undefined;
        }
        if(this.is('input[type="checkbox"]')){
            return this.is(':checked') ? true : false;
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

    get frame(){
        return this.parents.find(({ isFrame }) => isFrame);
    },

    get document(){
        return this.parents.find(({ isDocument }) => isDocument) || this;
    },

    get overlay(){
        return this.parents.find(({ isOverlay }) => isOverlay);
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
        if(this.realParent){
            clearTimers.call(this);
            if(this.realParent) this.realParent.node.removeChild(this.node);
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
    },

    observe: overload({
        ['object, function'](options, fn){
            const { add = false, remove = false, alter = false } = options;

            const observer = new MutationObserver(mutations => {
                mutations.forEach(
                    mutation => {
                        if(mutation.type == 'childList'){
                            if(add) mutation.addedNodes.forEach(node => fn(NodeWrapper.instanceFor(node), 'add'));
                            if(remove) mutation.removedNodes.forEach(node => fn(NodeWrapper.instanceFor(node), 'remove'));
                        }
                        if(mutation.type == 'attributes' && alter){
                            fn(NodeWrapper.instanceFor(mutation.target), 'alter', mutation.attributeName);
                        }
                        if(mutation.type == 'characterData' && alter){
                            fn(NodeWrapper.instanceFor(mutation.target), 'alter', 'value');
                        }
                    }
                )
            });
        
            observer.observe(this.node, {
                attributes: alter,
                characterData: 'alter',
                childList: add || remove,
                subtree: true
            });
    
            this._registeredObservers.push(observer);

            return this;
        },

        function(fn){
            return this.observe({ add: true, remove: true, alter: true }, fn);
        }
    })
});

function cleanChildren(){
    this.children.forEach(child => clean.call(child));
}

function clean(){
    if(this.is('.progress-bar')) return;

    [...this.node.childNodes].forEach(node => node._nodeWrapper && clean.call(node._nodeWrapper));

    while(this._registeredEventListeners.length){
        this.node.removeEventListener(...this._registeredEventListeners.pop());
    }

    while(this._registeredObservers.length){
        this._registeredObservers.pop().disconnect();
    }

    clearTimers.call(this);

    if(this._overlayChild) this._overlayChild.remove();

    delete this.node._nodeWrapper;
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
    if(this.is('.progress-bar')) return;
    const isEmptyFrame = this.is('.frame') && virtualChildren.length == 0;
    if(isEmptyFrame && attributes['data-load-on-init'] === undefined){
        attributes['data-load-on-init'] = 'true';
    }
    patchAttributes.call(this, attributes);
    if(isEmptyFrame) return;
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
        node = (type == 'svg' || this.node instanceof SVGElement) ? document.createElementNS('http://www.w3.org/2000/svg', type) : document.createElement(type);
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
        const progressBar = new this.constructor(this, 'div', {class: 'progress-bar', 'data-node-wrapper': 'progress-bar'})
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

const snakeify = (stringable) => {
    return `${stringable}`.split(/\//).map(segment =>
        segment.replace(/([A-Z])/g, '_$1').toLocaleLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '')
    ).join('/');
};

const dasherize = (stringable) => {
    return snakeify(stringable).replace(/_/g, '-');
};

const capitalize = (stringable) => {
    const [first, ...rest] = `${stringable}`;
    return `${first.toLocaleUpperCase()}${rest.join('')}`;
};

const uncapitalize = (stringable) => {
    const [first, ...rest] = `${stringable}`;
    return `${first.toLocaleLowerCase()}${rest.join('')}`;
};

const pascalize = (stringable) => {
    return snakeify(stringable).replace(/^[0-9]+/, '').split(/[^a-z0-9]+/).map(word => capitalize(word)).join('')
};

const camelize = (stringable) => {
    return uncapitalize(pascalize(stringable));
};

EventWrapper.NodeWrapper = NodeWrapper;

export const defineNodeWrapper = overload({
    ['string, object'](name, include){
        const abstract = include.abstract;
        delete include.abstract;
        NodeWrapper.register(name, abstract).include(include);
    },

    ['string, function'](name, initialize ){
        defineNodeWrapper(name, { 
            initialize(...args) {
                this.constructor.parent.prototype.initialize.call(this, ...args);

                initialize.call(this, this);
            }
        });
    }
});
