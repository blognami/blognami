
import { Component } from "../component.js";
import { loadFrame, getFrame, normalizeUrl } from "./helpers.js";

Component.register('pinstripe-anchor', {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);
        this.on('click', (event) => {
            const { confirm, target = '_self', method = 'GET', href, placeholder, skipPatch } = this.params;
            if(target == '_blank') return;
            if(normalizeUrl(href, window.location.href).host != window.location.host) return;
            event.preventDefault();
            loadFrame.call(this, { confirm, target, method, url: href, placeholderUrl: placeholder, skipPatch: skipPatch == 'true' });
        });

        const { target = '_self', method = 'GET', href, placeholder, preload } = this.params;
        if(target != '_blank'){
            const frame = target == '_overlay' ? this.frame : getFrame.call(this, target);
            if(method == 'GET' && preload != undefined) this.document.preload(normalizeUrl(href, frame.url));
            if(placeholder != undefined) this.document.preload(normalizeUrl(placeholder, frame.url));
        }

        if(this.is('input, textarea')) this.on('keyup', (event) => this.trigger('click'));
    }
});
