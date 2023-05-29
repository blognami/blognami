
import { loadFrame, removeFrame, loadCache, getFrame } from "./helpers.js";

export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        const { ignoreEventsFromChildren = false } = this.data;
        this.on('click', (event) => {
            if(ignoreEventsFromChildren && event.target != this) return;
            const { action = 'load', confirm, target = '_self', method = 'GET', href, preload } = { ...this.attributes, ...this.data };
            if(new URL(href, window.location.href).host != window.location.host) return;
            event.preventDefault();
            event.stopPropagation();
            if(action == 'load') loadFrame.call(this, confirm, target, method, href);
            if(action == 'remove') removeFrame.call(this, confirm, target);
        });

        (async () => {
            const { target = '_self', method = 'GET', href, preload } =  { ...this.attributes, ...this.data };
            if(method != 'GET' || preload == undefined) return;
            const frame = target == '_overlay' ? this.frame : getFrame.call(this, target);
            const url = new URL(
                href,
                frame.url
            );
            frame.load(url, {
                method: 'GET',
                preload: true
            })
        })();
    
        if(this.is('input, textarea')) this.on('keyup', (event) => this.trigger('click'));
    }
};