
import { Component } from "../component.js";

Component.register('pinstripe-global-styles', {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        const host = this.find('parents', el => el.node.shadowRoot );
        if(!host) return;

        host.shadow.node.adoptedStyleSheets = [ this.document.globalStyles ];
    }
});
