
import { defineNodeWrapper } from "../node_wrapper.js";
import { loadFrame, removeFrame } from "./helpers.js";

defineNodeWrapper('anchor', {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        const { ignoreEventsFromChildren = false } = this.data;
        this.on('click', (event) => {
            if(ignoreEventsFromChildren && event.target != this) return;
            event.preventDefault();
            event.stopPropagation();
            const { action = 'load', confirm, target = '_self', method = 'GET', href } = { ...this.attributes, ...this.data };
            if(action == 'load') loadFrame.call(this, confirm, target, method, href);
            if(action == 'remove') removeFrame.call(this, confirm, target);
        });

        if(this.is('input, textarea')) this.on('keyup', (event) => this.trigger('click'));
    }
});
