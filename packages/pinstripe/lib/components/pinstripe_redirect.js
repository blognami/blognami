
import { Component } from "../component.js";
import { loadFrame, getFrame, normalizeUrl } from "./helpers.js";

Component.register('pinstripe-redirect', {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        if(this.isFromCachedHtml) return;

        const { delay = '0', confirm, target = '_self', method = 'GET', url, placeholder } = this.params;
        this.setTimeout(() => {
            if(target == '_blank') return;
            if(normalizeUrl(url, window.location.href).host != window.location.host) return;
            loadFrame.call(this, { confirm, target, method, url, placeholderUrl: placeholder });
        }, parseInt(delay));
    }
});
