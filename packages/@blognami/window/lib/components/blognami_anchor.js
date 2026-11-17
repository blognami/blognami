
import { Component } from "../component.js";
import { loadFrame, getFrame, normalizeUrl } from "./helpers.js";

Component.register('blognami-anchor', {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);
        this.on('click', (event) => {
            const { confirm, target = '_self', method = 'GET', href, placeholder, skipPatch } = this.params;
            if(target == '_blank') return;
            const url = normalizeUrl(href, window.location.href);
            if(url.host != window.location.host) return;
            const { origin, pathname, search } = window.location;
            if(url.origin == origin && url.pathname == pathname && url.search == search && url.hash){
                const element = document.getElementById(decodeURIComponent(url.hash.slice(1)));
                const anchor = element && this.constructor.instanceFor(element);
                if(anchor && anchor != this && anchor.is('a[target="_overlay"]')){
                    event.preventDefault();
                    anchor.trigger('click');
                    return;
                }
            }
            event.preventDefault();
            loadFrame.call(this, { confirm, target, method, url: href, placeholderUrl: placeholder, skipPatch: skipPatch == 'true' });
        });

        const matchesHash = () => this.attributes.id == decodeURIComponent(window.location.hash.slice(1));
        if(this.params.target == '_overlay' && matchesHash()){
            this.setTimeout(() => {
                if(this.frame.status == 'complete'){
                    this.trigger('click');
                } else {
                    // Managed by the anchor too: the frame's patch re-initialises it, and the new instance clicks.
                    const handle = this.manage(this.frame.on('load', () => {
                        handle.destroy();
                        if(this.node.isConnected && matchesHash()) this.trigger('click');
                    }));
                }
            });
        }

        const { target = '_self', method = 'GET', href, placeholder, preload } = this.params;
        if(target != '_blank'){
            const frame = target == '_overlay' ? this.frame : getFrame.call(this, target);
            if(method == 'GET' && preload != undefined) this.document.preload(normalizeUrl(href, frame.url));
            if(placeholder != undefined) this.document.preload(normalizeUrl(placeholder, frame.url));
        }

        if(this.is('input, textarea')) this.on('keyup', (event) => this.trigger('click'));
    }
});
