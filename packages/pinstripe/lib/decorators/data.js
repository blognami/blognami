

import { Decorator } from '../decorator.js';
import { trapify } from '../trapify.js';

Decorator.register('data', {
    decorate(){
        const { component } = this;

        component.data = trapify({
            ...JSON.parse(this.attributes.data || '{}'),
            __set(target, name, value){
                target[name] = value;
                component.patch({ ...component.attributes, 'p-data': JSON.stringify(target) });
                component.trigger('data:change');
            }
        });
    }
});