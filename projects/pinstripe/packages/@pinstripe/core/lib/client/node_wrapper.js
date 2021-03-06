
import { capitalize } from './util/index.js';
import { VirtualNode } from './virtual_node.js';
import { EventWrapper } from './event_wrapper.js';

const nodeWrappers = [];

export class NodeWrapper {

    static get selector(){ return `.p-${this.name}` }

    static register(){
        const klass = this

        nodeWrappers.unshift(klass)

        Object.defineProperty(NodeWrapper.prototype, klass.name, {
            get: function(){
                let current = this.parent
                while(current){
                    if(current instanceof klass){
                        return current
                    }
                    current = current.parent
                }
            } 
        })
        
        Object.defineProperty(NodeWrapper.prototype, `is${capitalize(klass.name)}`, {
            get: function(){
                return this instanceof klass
            } 
        })
    }

    static instanceFor(node){
        if(!node._nodeWrapper){
            node._nodeWrapper = new NodeWrapper(node)
            nodeWrappers.some((klass) => {
                if(node._nodeWrapper.is(klass.selector)){
                    node._nodeWrapper = new klass(node)
                    return true
                }
            })
        }
        return node._nodeWrapper
    }

    constructor(node){
        this.node = node
        this._registeredEventListeners = []
        this._registeredTimers = []
    }


    get type(){
        return this.node instanceof DocumentType ? '#doctype' : this.node.nodeName.toLowerCase()
    }

    get attributes(){
        const out = {}
        if(this.node.attributes){
            for(let i = 0; i < this.node.attributes.length; i++){
                out[this.node.attributes[i].name] = this.node.attributes[i].value
            }
        }
        return out
    }

    get text(){
        return this.node.textContent
    }

    get realParent(){
        return this.node.parentNode ? this.constructor.instanceFor(this.node.parentNode) : null
    }

    get parent(){
        if(this._parent){
            return this._parent
        }
        return this.realParent
    }

    get parents(){
        const out = []
        let current = this
        while(current.parent){
            current = current.parent
            out.push(parent)
        }
        return out
    }

    get children(){
        return [...this.node.childNodes].map(
            node => this.constructor.instanceFor(node)
        )
    }

    get siblings(){
        if(this.parent){
            return this.parent.children
        } else {
            return [this]
        }
    }

    get previousSibling(){
        if(this.node.previousSibling){
            return this.constructor.instanceFor(this.node.previousSibling)
        } else {
            return null
        }
    }

    get nextSibling(){
        if(this.node.nextSibling){
            return this.constructor.instanceFor(this.node.nextSibling)
        } else {
            return null
        }
    }

    get nextSiblings(){
        const out = []
        let current = this
        while(current.nextSibling){
            current = current.nextSibling
            out.push(current)
        }
        return out
    }

    get previousSiblings(){
        const out = []
        let current = this
        while(current.previousSibling){
            current = current.previousSibling
            out.push(current)
        }
        return out
    }

    get descendants(){
        return this.find(() => true)
    }

    find(selector, out = []){
        this.children.forEach((child) => {
            if(child.is(selector)){
                out.push(child)
            }
            child.find(selector, out)
        })
        return out;
    }

    is(selector){
        if(typeof selector == 'function'){
            return selector.call(this, this)
        }
        return (this.node.matches || this.node.matchesSelector || this.node.msMatchesSelector || this.node.mozMatchesSelector || this.node.webkitMatchesSelector || this.node.oMatchesSelector || (() => false)).call(this.node, selector)
    }

    on(name, ...args){
        const fn = args.pop()
        const selector = args.pop()

        const wrapperFn = (event, ...args) => {
            const eventWrapper = EventWrapper.instanceFor(event)
            if(selector){
                if(eventWrapper.target.is(selector)){
                    return fn.call(eventWrapper.target, eventWrapper, ...args)
                }
            } else {
                return fn.call(this, eventWrapper, ...args)
            }
        }

        this.node.addEventListener(name, wrapperFn)

        this._registeredEventListeners.push([name, wrapperFn])

        return this
    }
    
    trigger(name, data){
        if (window.CustomEvent && typeof window.CustomEvent === 'function') {
            var event = new CustomEvent(name, { bubbles: true, cancelable: true, detail: data } );
        } else {
            var event = document.createEvent('CustomEvent')
            event.initCustomEvent(name, true, true, data)
        }
        
        this.node.dispatchEvent(event)

        return this
    }

    setTimeout(...args){
        const out = setTimeout(...args)
        this._registeredTimers.push(out)
        return out
    }

    setInterval(...args){
        const out = setInterval(...args)
        this._registeredTimers.push(out)
        return out
    }

    remove(){
        if(this.type != '#doctype'){
            clearTimers.call(this)
            this.realParent.node.removeChild(this.node)
        }
        return this
    }

    addClass(name){
        this.node.classList.add(name)
        return this
    }

    removeClass(name){
        this.node.classList.remove(name)
        return this
    }

    patch(html){
        cleanChildren.call(this)
        patchChildren.call(this, VirtualNode.fromString(html).children)
        initChildren.call(this)
        return this.children
    }

    append(html){
        return prepend.call(this, html)
    }

    prepend(html){
        return prepend.call(this, html, this.children[0])
    }

    insertBefore(html){
        return prepend.call(this.realParent, html, this)
    }

    insertAfter(html){
        return prepend.call(this.realParent, html, this.nextSibling)
    }

}

function cleanChildren(){
    this.children.forEach(child => clean.call(child))
}

function clean(){
    if(this.is('#p-progress-bar')){
        return
    }

    [...this.node.childNodes].forEach(node => node._nodeWrapper && clean.call(node._nodeWrapper))

    while(this._registeredEventListeners.length){
        this.node.removeEventListener(...this._registeredEventListeners.pop())
    }

    clearTimers.call(this)

    this.node._nodeWrapper = undefined
}

function clearTimers(){
    while(this._registeredTimers.length){
        clearTimeout(this._registeredTimers.pop())
    }
}

function initChildren(){
    this.children.forEach(child => initChildren.call(child))
}

function prepend(html, referenceChild){
    const out = []
    VirtualNode.fromString(html).children.forEach((virtualChild) => {
        out.push(insert.call(this, virtualChild, referenceChild))
    })
    return out
}

function patch(attributes, virtualChildren){
    patchAttributes.call(this, attributes)
    patchChildren.call(this, virtualChildren)
}

function patchAttributes(attributes){
    if(this.type == '#text' || this.type == '#comment'){
        if(this.node.textContent != attributes.value){
            this.node.textContent = attributes.value
        }
    } else if(this.type != '#doctype'){
        const currentAttributes = this.attributes
        Object.keys(currentAttributes).forEach((key) => {
            if(attributes[key] === undefined){
                this.node.removeAttribute(key)
            }
        })
        Object.keys(attributes).forEach((key) => {
            if(currentAttributes[key] != attributes[key]){
                this.node.setAttribute(key, attributes[key])
            }
        })
    }
}

function patchChildren(virtualChildren){
    const children = [...this.node.childNodes].map(
        node => new NodeWrapper(node)
    )

    for(let i = 0; i < virtualChildren.length; i++){
        let child = children[0]
        const virtualChild = virtualChildren[i]

        if(child && child.type == virtualChild.type){
            patch.call(children.shift(), virtualChild.attributes, virtualChild.children)
        } else if(virtualChild.type == '#doctype'){
            // ignore
        } else if(virtualChild.type.match(/^#(text|comment)/)){
            insert.call(this, virtualChild, child)
        } else {
            while(children.length > 0 && children[0].type.match(/^#/)){
                children.shift().remove()
            }
            child = children[0]
            if(child && child.type == virtualChild.type){
                patch.call(children.shift(), virtualChild.attributes, virtualChild.children);
            } else {
                insert.call(this, virtualChild, child)
            }
        }
    }

    while(children.length > 0){
        children.shift().remove()
    }
}

function insert(virtualNode, referenceChild, returnNodeWrapper = true){
    const { type, attributes, children } = virtualNode

    let node

    if(type == '#text'){
        node = document.createTextNode(attributes.value)
    } else if(type == '#comment'){
        node = document.createComment(attributes.value)
    } else {
        node = document.createElement(type)
        Object.keys(attributes).forEach((key) => {
            node.setAttribute(key, attributes[key]) 
        })
    }

    children.forEach(child => {
        insert.call(new NodeWrapper(node), child, null, false)
    })
    
    this.node.insertBefore(
        node,
        referenceChild && referenceChild.node
    )
    
    if(returnNodeWrapper){
        return NodeWrapper.instanceFor(node)
    }
}

EventWrapper.NodeWrapper = NodeWrapper
