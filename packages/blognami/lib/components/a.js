
import { loadFrame, getFrame } from "./helpers.js";

export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        const { ignoreEventsFromChildren = false } = this.data;
        this.on('click', (event) => {
            if(ignoreEventsFromChildren && event.target != this) return;
            const { confirm, target = '_self', method = 'GET', href, placeholder } = { ...this.attributes, ...this.data };
            if(new URL(href, window.location.href).host != window.location.host) return;
            event.preventDefault();
            event.stopPropagation();
            loadFrame.call(this, confirm, target, method, href, placeholder);
        });

        const { target = '_self', method = 'GET', href, preload, placeholder } =  { ...this.attributes, ...this.data };
        if(method == 'GET' && target != '_blank'){
            const frame = target == '_overlay' ? this.frame : getFrame.call(this, target);
            if(preload != undefined) this.document.preload(new URL(href, frame.url));
            if(placeholder != undefined) this.document.preload(new URL(placeholder, frame.url));
        }

        if(this.is('input, textarea')) this.on('keyup', (event) => this.trigger('click'));
    }
};