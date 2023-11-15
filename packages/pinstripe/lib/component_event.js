
import { Class } from './class.js';
import { trapify } from './trapify.js';

export const ComponentEvent = Class.extend().include({
    meta(){
        this.assignProps({
            instanceFor(event){
                if(!event._componentEvent){
                    event._componentEvent = ComponentEvent.new(event);
                }
                return event._componentEvent;
            }
        });
    },

    initialize(event){
        this.event = event;
        return trapify(this);
    },

    __get(target, name){
        const out = target.event[name];
        if(out instanceof Node) return ComponentEvent.Component.instanceFor(out);
        if(typeof out == 'function') return (...args) => out.call(target.event, ...args);
        return out;
    }
});
