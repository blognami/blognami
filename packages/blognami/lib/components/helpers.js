
import { LruCache } from '../lru_cache.js';

export const loadCache = LruCache.new();

export function loadFrame(confirm, target, method, url, placeholderUrl){
    if(confirm && !window.confirm(confirm)){
        return;
    }

    let frame;
    
    if(target == '_overlay'){
        this.document.body.clip();
        frame = this.document.descendants.find(node => node.is('body')).append(`<blognami-overlay load-on-init="false"></blognami-overlay>`).pop();
        frame._parent = this;
        this._overlayChild = frame;
    } else {
        frame = getFrame.call(this, target);
        if(!frame) return;
    }

    url = new URL(url || frame.url, this.frame.url);
    if(url.protocol != 'data:' && (url.host != frame.url.host || url.port != frame.url.port)){
        return;
    }

    if(placeholderUrl) placeholderUrl = new URL(placeholderUrl, this.frame.url);

    if(method.match(/POST|PUT|PATCH/i)){
        const formData = new FormData();
        const values = this.values;
        Object.keys(values).forEach((name) => formData.append(name, values[name]));
        frame.load(url, { method, body: formData, placeholderUrl });
    } else {
        frame.load(url, { method, placeholderUrl });
    }    
}

export function getFrame(target){
    if(target == '_self') return this.frame;
    if(target == '_top') return this.document;
    if(target.match(/^_parent/)){
        const index = target.split(/_/).length - 1;
        return this.parents.filter(n => n.isFrame)[index];
    }
    return this.frame.descendants.find(n => n.isFrame && n.data.name == target);
}
