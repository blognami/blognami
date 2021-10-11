
import { Base } from './base.js';

export const EventWrapper = Base.extend().include({
    meta(){
        this.assignProps({
            instanceFor(event){
                if(!event._eventWrapper){
                    event._eventWrapper = this.new(event);
                }
                return event._eventWrapper;
            }
        })
    },
    
    initialize(event){
        this.event = event;
    },

    get target(){
        return EventWrapper.NodeWrapper.instanceFor(this.event.target);
    },

    stopPropagation(){
        this.event.stopPropagation();
    },

    preventDefault(){
        this.event.preventDefault();
    }
});
