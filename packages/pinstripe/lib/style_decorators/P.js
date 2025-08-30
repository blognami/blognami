
import { StyleDecorator } from "../style_decorator.js";

StyleDecorator.register('P', {
    apply(){
        this.styles['padding'] = this.value;
    }
});