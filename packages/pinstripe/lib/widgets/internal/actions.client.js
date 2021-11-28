
import { Url } from '../../url.js';

export function load(){
    const { confirm, method = 'GET', target = '_self'} = this.data;

    if(confirm && !window.confirm(confirm)){
        return;
    }

    let frame;
    
    if(target == '_overlay'){
        this.document.descendants.filter(node => node.is('html')).forEach(node => {
            node.addClass(this.document.hasOverlayCssClass);
        });
        frame = this.document.descendants.find(node => node.is('body')).append(`<div data-widget="internal/overlay"></div>`).pop();
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
}

export function remove(){
    const { confirm, target = '_self'} = this.data;

    if(confirm && !window.confirm(confirm)){
        return;
    }

    const frame = getFrame.call(this, target);
    if(frame) frame.remove();
}

function getFrame(target){
    if(target == '_self') return this.frame;
    if(target == '_top') return this.document;
    if(target.match(/^_parent/)){
        const index = target.split(/_/).length - 1;
        return this.parents.filter(n => n.isFrame)[index];
    }
    return this.frame.decendants.find(n => n.isFrame && n.data.name == target);
}