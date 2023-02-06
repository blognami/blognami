
import { Component } from "../component.js";
import { loadFrame, removeFrame } from "./helpers.js";

Component.register('pinstripe-anchor', {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        const { ignoreEventsFromChildren = false } = this.data;
        this.on('click', (event) => {
            if(ignoreEventsFromChildren && event.target != this) return;
            const { action = 'load', confirm, target = '_self', method = 'GET', href } = { ...this.attributes, ...this.data };
            if(new URL(href, window.location.href).host != window.location.host) return;
            event.preventDefault();
            event.stopPropagation();
            if(action == 'load') loadFrame.call(this, confirm, target, method, href);
            if(action == 'remove') removeFrame.call(this, confirm, target);
        });
    
        if(this.is('input, textarea')) this.on('keyup', (event) => this.trigger('click'));
    }
});