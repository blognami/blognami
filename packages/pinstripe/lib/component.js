
import { Class } from './class.js';
import { TEXT_ONLY_TAGS } from './constants.js';
import { Inflector } from './inflector.js';
import { VirtualNode } from './virtual_node.js';
import { Registry } from './registry.js';
import { ComponentEvent } from './component_event.js';
import { generateProofOfWork } from './proof_of_work.js';

export const Component = Class.extend().include({
    meta(){
        this.assignProps({ name: 'Component' });

        this.include(Registry);

        this.assignProps({
            instanceFor(node){
                if(!node._component){
                    node._component = Component.new(node, true);
                    node._component = Component.create(
                        node._component.attributes['data-component'] || (node._component.type == '#document' ? 'pinstripe-document' : node._component.type),
                        node
                    );
                    (node._component.attributes.class || '').trim().split(/\s+/).forEach((className) => {
                        const decoratorMethodName = `.${className}`;
                        if(typeof node._component[decoratorMethodName] == 'function'){
                            node._component[decoratorMethodName]();
                        }
                    });
                    if(node.isConnected) node._component.trigger('init', { bubbles: false });
                }
                return node._component;
            },

            normalizeName(name){
                return Inflector.instance.dasherize(name);
            }
        });
    },

    initialize(node, skipInit = false){
        this.node = node;
        this._registeredEventListeners = [];
        this._registeredObservers = [];
        this._registeredTimers = [];
        this._registeredAbortControllers = [];
        this._virtualNodeFilters = [];

        this.addVirtualNodeFilter(function(){
            this.traverse(normalizeVirtualNode);
        });

        if(skipInit) return;

        const { autofocus } = this.attributes;

        if(autofocus){
            this.setTimeout(() => this.node.focus());
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

    get params(){
        const out = {};
        const { attributes } = this;
        Object.keys(attributes).forEach(name => {
            const normalizedName = name.replace(/^data-/, '').replace(/-[a-z]/g, item => item[1].toUpperCase());
            out[normalizedName] = attributes[name];
        });
        return out;
    },

    get text(){
        return this.node.textContent;
    },

    get html(){
        return this.node.innerHTML;
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
        return this.is('input, textarea, select');
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
        if(this.is('select')){
            return this.findAll('option').map(option => option.value)[this.node.selectedIndex];
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

    get modal(){
        return this.parents.find(({ isModal }) => isModal);
    },

    get form(){
        return this.parents.find(({ isForm }) => isForm);
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
            remove.call(this);
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
                insert.call(new Component(this.node, true), { type: '#text', attributes: { value: html }, children: [] }, null, false);
            } else {
                patchChildren.call(new Component(this.node, true), createVirtualNode.call(this, html).children);
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
        const { minimumDelay = 0, requiresProofOfWork = false, ...otherOptions } = options;
        const frame = this.frame || this;
        const normalizedUrl = new URL(url, frame.url);
        const abortController = new AbortController();
        this._registeredAbortControllers.push(abortController);
        let minimumDelayTimeout;
        const cleanUp = () => {
            clearTimeout(minimumDelayTimeout);
            this._registeredAbortControllers = this._registeredAbortControllers.filter(item => item !== abortController);
        };
        try {
            if(requiresProofOfWork){
                if(!(otherOptions.body instanceof FormData)) throw new Error(`Proof of work requires form data to be present`);
                const values = {};
                otherOptions.body.forEach((value, key) => values[key] = value);
                otherOptions.body.append('_proofOfWork', await generateProofOfWork(values, { 
                    abortSignal: abortController.signal,
                    onProgress: progress => this.trigger('proofOfWorkProgress', { data: progress, bubbles: false })
                }))
            }
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

    findAll(...args){
        if(args.length == 1) args.unshift('descendants');
        const [ collection, selector ] = args;
        return this[collection].filter(item => item.is(selector));
    }
});

function remove(){
    this.node.parentNode.removeChild(this.node);
}

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
        out.push(insert.call(new Component(this.node, true), { type: '#text', attributes: { value: html }, children: [] }, referenceChild));
    } else {
        createVirtualNode.call(this, html).children.forEach((virtualChild) => {
            out.push(insert.call(new Component(this.node, true), virtualChild, referenceChild));
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
    if(this.type == 'template'){
        patchChildren.call(new Component(this.node.content, true), virtualChildren);
    } else {
        patchChildren.call(new Component(this.node, true), virtualChildren);
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
                Element.prototype.removeAttribute.call(this.node, key); // work around for https://github.com/cypress-io/cypress/issues/26206
                // this.node.removeAttribute(key);
                if(key == 'checked') this.node.checked = false;
            }
        })
        Object.keys(attributes).forEach((key) => {
            if(!currentAttributes.hasOwnProperty(key) || currentAttributes[key] != attributes[key]){
                this.node.setAttribute(key, attributes[key]);
                if(key == 'value') this.node.value = attributes[key];
                if(key == 'checked') this.node.checked = true;
            }
        })
    }
}

function patchChildren(virtualChildren){
    if(this.type == 'head') return patchHeadChildren.call(this, virtualChildren);

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
            insert.call(this, virtualChild, child, false);
        } else {
            while(children.length > 0 && children[0].type.match(/^#/)){
                remove.call(children.shift());
            }
            child = children[0]
            if(child && child.type == virtualChild.type){
                patch.call(new Component(children.shift().node, true), virtualChild.attributes, virtualChild.children);
            } else {
                insert.call(new Component(this.node, true), virtualChild, child, false);
            }
        }
    }

    while(children.length > 0){
        remove.call(children.shift());
    }
}

function patchHeadChildren(virtualChildren){
    const children = [...this.node.childNodes].map(
        node => new Component(node, true)
    );

    const stylesheets = {};
    for(let i = 0; i < virtualChildren.length; i++){
        const virtualChild = virtualChildren[i];
        if(virtualChild.type != 'link') continue;
        if(virtualChild.attributes.rel != 'stylesheet') continue;
        const href = virtualChild.attributes.href;
        stylesheets[href] = virtualChild;
    }
    while(children.length > 0){
        const child = children.shift();
        if(child.type == 'link' && child.attributes.rel == 'stylesheet'){
            const { href } = child.attributes;
            const stylesheet = stylesheets[href];
            if(stylesheet){
                patch.call(child, stylesheet.attributes, stylesheet.children);
                continue;
            }
        }
        remove.call(child);
    }

    for(let i = 0; i < virtualChildren.length; i++){
        const virtualChild = virtualChildren[i];
        if(virtualChild.type == 'script') continue;
        if(virtualChild.type == 'link' && virtualChild.attributes.rel == 'stylesheet' && stylesheets[virtualChild.attributes.href]) continue;
        insert.call(this, virtualChild, null, false);
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
        if(type == 'template'){
            insert.call(new Component(node.content, true), child, null, false);
        } else {
            insert.call(new Component(node, true), child, null, false);
        }
    })
    
    this.node.insertBefore(
        node,
        referenceChild && referenceChild.node
    );
    
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

    if(!this.attributes['data-component']){
        if(this.type == 'a'){
            this.attributes['data-component'] = 'pinstripe-anchor';
        }

        if(this.type == 'body'){
            this.attributes['data-component'] = 'pinstripe-body';
        }

        if(this.type == 'form'){
            this.attributes['data-component'] = 'pinstripe-form';
        }

        if(this.type == 'script' && this.attributes.type == 'pinstripe'){
            this.attributes['data-component'] = 'pinstripe-script';
        }
    }
}

ComponentEvent.Component = Component;
