
import { LruCache } from '../lru_cache.js';

export const loadCache = LruCache.new();

export function loadFrame({ confirm, target, method, url, placeholderUrl, requiresProofOfWork = false, values = this.values }){
    if(confirm && !window.confirm(confirm)){
        return;
    }

    let frame;
    
    if(target == '_overlay'){
        frame = this.document.descendants.find(node => node.is('body')).append(`<pinstripe-overlay load-on-init="false"></pinstripe-overlay>`).pop();
        frame._parent = this;
        this._overlayChild = frame;
    } else if(target) {
        frame = getFrame.call(this, target);
    } else if(this.isFrame) {
        frame = this;
    }

    if(!frame) return;

    url = normalizeUrl(url || frame.url, this.frame.url);
    if(url.protocol != 'data:' && (url.host != frame.url.host || url.port != frame.url.port)){
        return;
    }

    if(placeholderUrl) placeholderUrl = normalizeUrl(placeholderUrl, this.frame.url);

    if(method.match(/POST|PUT|PATCH/i)){
        const formData = new FormData();
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
        out.search = `?${stringifyUrlSearch({
            ...parseUrlSearch(out.search),
            ...parseUrlSearch(`${matches[1]}`)
        })}`;
    }
    return out;
}

function parseUrlSearch(search){
    const out = {};
    search.replace(/^\?/, '').split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        out[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return out;
}

function stringifyUrlSearch(search){
    return Object.keys(search).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(search[key])}`).join('&');
}
