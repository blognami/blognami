
export class EventWrapper {

    static instanceFor(event){
        if(!event._eventWrapper){
            event._eventWrapper = new this(event);
        }
        return event._eventWrapper;
    }
    
    constructor(event){
        this.event = event;
    }

    get target(){
        return EventWrapper.Component.instanceFor(this.event.target);
    }

    stopPropagation(){
        this.event.stopPropagation();
    }

    preventDefault(){
        this.event.preventDefault();
    }
}
