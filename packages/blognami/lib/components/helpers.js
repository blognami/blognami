
import { LruCache } from '../lru_cache.js';

export const loadCache = LruCache.new();

export function loadFrame(confirm, target, method, url, placeholderUrl, requiresProofOfWork = false){
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

    url = normalizeUrl(url || frame.url, this.frame.url);
    if(url.protocol != 'data:' && (url.host != frame.url.host || url.port != frame.url.port)){
        return;
    }

    if(placeholderUrl) placeholderUrl = normalizeUrl(placeholderUrl, this.frame.url);

    if(method.match(/POST|PUT|PATCH/i)){
        const formData = new FormData();
        const values = this.values;
        Object.keys(values).forEach((name) => formData.append(name, values[name]));
        frame.load(url, { method, body: formData, placeholderUrl, requiresProofOfWork });
    } else {
        frame.load(url, { method, placeholderUrl, requiresProofOfWork });
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

export function normalizeUrl(url, referenceUrl = window.location){
    const matches = `${url}`.match(/^&(.*)$/);
    const out = matches ? new URL(referenceUrl) : new URL(url, referenceUrl);
    if(matches){
        if(out.search){
            out.search = `${out.search}&${matches[1]}`;
        } else {
            out.search = `?${matches[1]}`;
        }
    }
    return out;
}