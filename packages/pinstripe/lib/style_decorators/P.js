
import { StyleDecorator } from "../style_decorator.js";

StyleDecorator.register('P', {
    apply(){
        this.style.properties['padding'] = this.value;
    }
});