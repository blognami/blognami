
import { ComponentDecorator } from '../component_decorator.js';

ComponentDecorator.register('on', {
    decorate(){
        for(const [name, value] of Object.entries(this.attributes)){
            const matches = name.match(/^on:(.+)$/);
            if(!matches) continue;
            const eventName = matches[1];
            const fn = new Function('event', value);
            this.component.on(eventName, fn);
        }
    }
});