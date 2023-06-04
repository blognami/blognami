
import { fileURLToPath } from 'url'; // pinstripe-if-client: const fileURLToPath = undefined;

import { Class } from './class.js';
import { TEXT_ONLY_TAGS } from './constants.js';
import { Inflector } from './inflector.js';
import { VirtualNode } from './virtual_node.js';
import { Registry } from './registry.js';
import { ComponentEvent } from './component_event.js';
import { Client } from './client.js'; // pinstripe-if-client: const Client = undefined;

export const Component = Class.extend().include({
    meta(){
        this.include(Registry);

        const { importFile } = this;

        this.assignProps({
            instanceFor(node){
                if(!node._component){
                    node._component = Component.new(node, true);
                    node._component = Component.create(
                        node._component.attributes['data-component'] || node._component.type,
                        node
                    );
                    if(node.isConnected) node._component.trigger('init', { bubbles: false });
                }
                return node._component;
            },

            normalizeName(name){
                return Inflector.instance.dasherize(name);
            }
        });

        this.FileImporter.register('js', {
            meta(){
                const { importFile} = this.prototype;

                this.include({
                    async importFile(params){
                        const { filePath, relativeFilePathWithoutExtension } = params;
                        if((await import(filePath)).default){
                            Client.instance.addModule(`
                                import { Component } from ${JSON.stringify(fileURLToPath(`${import.meta.url}/../index.js`))};
                                import include from ${JSON.stringify(filePath)};
                                Component.register(${JSON.stringify(relativeFilePathWithoutExtension)}, include);
                            `);
                        } else {
                            Client.instance.addModule(`
                                import ${JSON.stringify(filePath)};
                            `);
                        }
                        return importFile.call(this, params);
                    }
                })
            }
        })
    },

    initialize(node, skipInit = false){
        this.node = node;
        this._registeredEventListeners = [];
        this._registeredObservers = [];
        this._registeredTimers = [];
        this._registeredAbortControllers = [];
        this._virtualNodeFilters = [];

        if(skipInit) return;

        this.addVirtualNodeFilter(function(){
            this.traverse(normalizeVirtualNode);
        });

        const { autofocus } = this.attributes;

        if(autofocus){
            this.setTimeout(() => this.node.focus());
        }

        const { autosubmit, trigger, decorate } = this.data;

        // replace with pinstripe-autosubmitter?
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

        // replace with script?
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
            let normalizedName = name;
            const matches = normalizedName.match(/^data-(.+)$/);
            if(matches) normalizedName = matches[1];
            normalizedName = normalizedName.toLowerCase().replace(/-[a-z]/g, item => item[1].toUpperCase());
            const value = attributes[name];
            try {
                out[normalizedName] = JSON.parse(value);
            } catch(e){
                out[normalizedName] = value;
            }
        })
        return out;
    },

    get text(){
        return this.node.textContent;
    },

    get realParent(){
        if(this.node.parentNode) return this.constructor.instanceFor(this.node.parentNode);
        if(this.node.host instanceof Element) return this.constructor.instanceFor(this.node.host);
        return null;
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

    get parentsIncludingThis(){
        return [this, ...this.parents];
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
        return this.find('parentsIncludingThis', ({ isDocument }) => isDocument);
    },

    get overlay(){
        return this.parents.find(({ isOverlay }) => isOverlay);
    },

    get shadow(){
        if(!this.node.shadowRoot){
            this.node.attachShadow({ mode: 'open' });
            this.shadow.observe({ add: true }, component => component.descendants);
            this.shadow.patch(`<slot>`);
        }
        return Component.instanceFor(this.node.shadowRoot);
    },

    focus(){
        this.node.focus();
        return this;
    },

    is(selector){
        if(typeof selector == 'function'){
            return selector.call(this, this)
        }
        try {
            return matchesSelector.call(this.node, selector);
        } catch(e){
            return false;
        }
    },

    on(name, ...args){
        const fn = args.pop()
        const selector = args.pop()

        const wrapperFn = (event, ...args) => {
            const eventWrapper = ComponentEvent.instanceFor(event)
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
            clean.call(this);
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

    patch(arg1){
        if(typeof arg1 == 'string'){
            const html = arg1;
            cleanChildren.call(this);
            if(TEXT_ONLY_TAGS.includes(this.type)){
                insert.call(this, { type: '#text', attributes: { value: html }, children: [] });
            } else {
                patchChildren.call(this, createVirtualNode.call(this, html).children);
            }
            initChildren.call(this);
            return this.children;
        }
        const attributes = arg1;
        patchAttributes.call(this, attributes);
        return this;
    },

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

    observe(...args){
        if(args.length == 1) args.unshift({ add: true, remove: true, alter: true });
        const [ options, fn ] = args;
        const { add = false, remove = false, alter = false } = options;

        const observer = new MutationObserver(mutations => {
            mutations.forEach(
                mutation => {
                    if(mutation.type == 'childList'){
                        if(add) mutation.addedNodes.forEach(node => fn(Component.instanceFor(node), 'add'));
                        if(remove) mutation.removedNodes.forEach(node => fn(Component.instanceFor(node), 'remove'));
                    }
                    if(mutation.type == 'attributes' && alter){
                        fn(Component.instanceFor(mutation.target), 'alter', mutation.attributeName);
                    }
                    if(mutation.type == 'characterData' && alter){
                        fn(Component.instanceFor(mutation.target), 'alter', 'value');
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

    async fetch(url, options = {}){
        const { minimumDelay = 0, ...otherOptions } = options;
        const { progressBar } = this.document;
        const frame = this.frame || this;
        const normalizedUrl = new URL(url, frame.url);
        const abortController = new AbortController();
        this._registeredAbortControllers.push(abortController);
        progressBar.start();
        let minimumDelayTimeout;
        const cleanUp = () => {
            clearTimeout(minimumDelayTimeout);
            this._registeredAbortControllers = this._registeredAbortControllers.filter(item => item !== abortController);
            progressBar.stop();
        };
        try {
            const promises = [
                fetch(normalizedUrl, { signal: abortController.signal, ...otherOptions }), 
                new Promise(resolve => minimumDelayTimeout = setTimeout(resolve, minimumDelay))
            ];
            const [ out ] = await Promise.all(promises);
            cleanUp();
            return out;
        } catch(e){
            cleanUp();
            throw e;
        }
    },

    abort(){
        while(this._registeredAbortControllers.length){
            this._registeredAbortControllers.pop().abort();
        }
        return this;
    },

    find(...args){
        if(args.length == 1) args.unshift('descendants');
        const [ collection, selector ] = args;
        return this[collection].find(item => item.is(selector));
    },

    findAll(){
        if(args.length == 1) args.unshift('descendants');
        const [ collection, selector ] = args;
        return this[collection].filter(item => item.is(selector));
    }
});

const matchesSelector = (() => {
    if(typeof window == 'undefined') return () => false;
    const node = document.documentElement;
    return node.matches || node.matchesSelector || node.msMatchesSelector || node.mozMatchesSelector || node.webkitMatchesSelector || node.oMatchesSelector;
})();

function cleanChildren(){
    if(this.node.shadowRoot){
        this.shadow.children.forEach(child => clean.call(child));
    }
    this.children.forEach(child => clean.call(child));
}

function clean(){
    this.trigger('clean', { bubbles: false });

    [...this.node.childNodes].forEach(node => node._component && clean.call(node._component));

    while(this._registeredEventListeners.length){
        this.node.removeEventListener(...this._registeredEventListeners.pop());
    }

    while(this._registeredObservers.length){
        this._registeredObservers.pop().disconnect();
    }

    clearTimers.call(this);

    this.abort();

    if(this._overlayChild) this._overlayChild.remove();

    delete this.node._component;
}

function clearTimers(){
    while(this._registeredTimers.length){
        clearTimeout(this._registeredTimers.pop());
    }
}

function initChildren(){
    if(this.node.shadowRoot){
        this.shadow.children.forEach(child => initChildren.call(child));
    }
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
    const isFrame = this.type == 'pinstripe-frame' || this.attributes['data-component'] == 'pinstripe-frame';
    const isEmptyFrame = isFrame && virtualChildren.length == 0;
    if(isEmptyFrame && attributes['data-load-on-init'] === undefined){
        attributes['data-load-on-init'] = 'true';
    }
    patchAttributes.call(this, attributes);
    if(isEmptyFrame) return;
    if(this.is('pinstripe-silo, [data-component="pinstripe-silo"]')){
        patchChildren.call(this.shadow, virtualChildren);
        patchChildren.call(this, []);
    } else {
        patchChildren.call(this, virtualChildren);
    }
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
        node => new Component(node, true)
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

function insert(virtualNode, referenceChild, returnComponent = true){
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
        insert.call(new Component(node, true), child, null, false);
    })
    
    if(this.is('pinstripe-silo, [data-component="pinstripe-silo"]')){
        this.shadow.node.insertBefore(
            node,
            referenceChild && referenceChild.node
        );
    } else {
        this.node.insertBefore(
            node,
            referenceChild && referenceChild.node
        );
    }
    
    if(returnComponent){
        return Component.instanceFor(node);
    }
}

function normalizeVirtualNode(){
    if(!this.parent && this.children.some(child => child.type == 'html')){
        this.children = [
            new this.constructor(this, '#doctype'),
            ...this.children.filter(child => child.type == 'html')
        ];
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

ComponentEvent.Component = Component;
