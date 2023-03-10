
import { Component } from "../component.js";

Component.register('pinstripe-silo', {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);
    }
});
