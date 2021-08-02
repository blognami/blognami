
import { Widget } from 'pinstripe';

Widget.register('script').staticProps({ selector: 'script[type="pinstripe"]' }).props({
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);
        new Function(this.text).call(this);
    }
});
