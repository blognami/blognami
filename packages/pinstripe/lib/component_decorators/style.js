
import { ComponentDecorator } from '../component_decorator.js';
import { StyleDecorator } from '../style_decorator.js';
import { StyleScope } from '../style_scope.js';

import '../style_decorators/index.js';

ComponentDecorator.register('style', {
    decorate(){
        const styles = {};
        for(const [name, value] of Object.entries(this.attributes)){
            const modifiers = name.replace(/^style:/, '').split(':');
            StyleDecorator.applyDecorators(value, styles);

        }
        console.log(`styles ${JSON.stringify(styles, null, 2)}`);
    },

    createCssSelector(){
        
    }
});