
import { Decorator } from '../decorator.js';

Decorator.register('on', {
    decorate(){
        console.log('on decorator', this.component);
    }
});