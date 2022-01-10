
import { Url } from '../url.js';

export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);
        const { action = 'load', event = 'init', ignoreEventsFromChildren = false } = this.data;
        if(!action) return;
        this.on(event, (event, ...args) => {
            if(ignoreEventsFromChildren && event.target != this) return;
            event.preventDefault();
            event.stopPropagation();
            const fn = actions[action];
            if(typeof fn !== 'function'){
                console.error(`No such action '${action}' exists.`);
                return;
            }
            fn.call(this, event, ...args);
        });
    }
};


const actions = {
    load(){
        const { confirm, method = 'GET', target = '_self'} = this.data;

        if(confirm && !window.confirm(confirm)){
            return;
        }

        let frame;
        
        if(target == '_overlay'){
            this.document.descendants.filter(node => node.is('html')).forEach(node => {
                node.addClass(this.document.hasOverlayCssClass);
            });
            frame = this.document.descendants.find(node => node.is('body')).append(`<div data-widget="overlay"></div>`).pop();
            frame._parent = this;
        } else {
            frame = getFrame.call(this, target);
            if(!frame) return;
        }

        const url = Url.fromString(this.data.url || frame.url, this.frame.url);
        if(url.host != frame.url.host || url.port != frame.url.port){
            return;
        }

        frame.load({ ...this.values, _method: method, _url: url });
    },

    remove(){
        const { confirm, target = '_self'} = this.data;

        if(confirm && !window.confirm(confirm)){
            return;
        }

        const frame = getFrame.call(this, target);
        if(frame) frame.remove();
    }
};

function getFrame(target){
    if(target == '_self') return this.frame;
    if(target == '_top') return this.document;
    if(target.match(/^_parent/)){
        const index = target.split(/_/).length - 1;
        return this.parents.filter(n => n.isFrame)[index];
    }
    return this.frame.decendants.find(n => n.isFrame && n.data.name == target);
}
