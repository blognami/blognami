
import { defineWidget } from 'pinstripe';

defineWidget('script', {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);
        new Function(this.text).call(this);
    }
});
