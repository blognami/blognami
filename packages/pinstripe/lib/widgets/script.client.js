
import { Widget } from 'pinstripe';

Widget.register('script').include({
    meta(){
        this.assignProps({ selector: 'script[type="pinstripe"]' })
    },

    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);
        new Function(this.text).call(this);
    }
});
