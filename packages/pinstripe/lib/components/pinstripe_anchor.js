
import { loadFrame, getFrame, normalizeUrl } from "./helpers.js";

export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);
        this.on('click', (event) => {
            const { confirm, target = '_self', method = 'GET', href, placeholder } = this.params;
            if(normalizeUrl(href, window.location.href).host != window.location.host) return;
            event.preventDefault();
            loadFrame.call(this, confirm, target, method, href, placeholder);
        });

        const { target = '_self', method = 'GET', href, placeholder, preload } = this.params;
        if(method == 'GET' && target != '_blank'){
            const frame = target == '_overlay' ? this.frame : getFrame.call(this, target);
            if(preload != undefined) this.document.preload(normalizeUrl(href, frame.url));
            if(placeholder != undefined) this.document.preload(normalizeUrl(placeholder, frame.url));
        }

        if(this.is('input, textarea')) this.on('keyup', (event) => this.trigger('click'));
    }
};
