
import { Base } from './base.js';

export const EventWrapper = Base.extend().open(Class => Class
    .staticProps({
        instanceFor(event){
            if(!event._eventWrapper){
                event._eventWrapper = new this(event)
            }
            return event._eventWrapper
        }
    })
    .props({
        initialize(event){
            this.event = event
        },
    
        get target(){
            return EventWrapper.NodeWrapper.instanceFor(this.event.target)
        },
    
        stopPropagation(){
            this.event.stopPropagation()
        },
    
        preventDefault(){
            this.event.preventDefault()
        }
    })
);
