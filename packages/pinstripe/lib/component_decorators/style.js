
import { ComponentDecorator } from '../component_decorator.js';
import { StyleDecorator } from '../style_decorator.js';
import { Style } from '../style.js';

import '../style_decorators/index.js';

ComponentDecorator.register('style', {
    decorate(){
        const style = Style.new();
        for(const [name, decorators] of Object.entries(this.attributes)){
            StyleDecorator.applyDecorators(decorators, style);
            const namespaceDecorators = name.replace(/^style(:|$)/, '').split(':').filter(Boolean).map(modifier => `@${modifier}`).join(';');
            StyleDecorator.applyDecorators(namespaceDecorators, style);
        }
        console.log(style.toString());
    },

    createCssSelector(){
        
    }   
});