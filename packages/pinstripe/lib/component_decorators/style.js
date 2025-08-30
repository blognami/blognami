
import { ComponentDecorator } from '../component_decorator.js';
import { StyleDecorator } from '../style_decorator.js';
import { Style } from '../style.js';

import '../style_decorators/index.js';

ComponentDecorator.register('style', {
    decorate(){
        const style = Style.new();
        for(const [name, value] of Object.entries(this.attributes)){
            const modifiers = name.replace(/^style:/, '').split(':');
            StyleDecorator.applyDecorators(value, style);
        }
        console.log(style.toString());
    },

    createCssSelector(){
        
    }   
});