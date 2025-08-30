

import { ComponentDecorator } from '../component_decorator.js';
import { trapify } from '../trapify.js';

ComponentDecorator.register('data', {
    decorate(){
        const { component } = this;

        component.assignProps({
            get data(){
                return this._data;
            },

            set data(data){
                this._data = trapify({ ...data, __set: (target, name, value) => {
                    target[name] = value;
                    this.patch({ ...this.attributes, 'p-data': JSON.stringify(target) });
                    this.trigger('data:change', { bubbles: false });
                }});
                this.patch({ ...this.attributes, 'p-data': JSON.stringify(data) });
                this.trigger('data:change', { bubbles: false });
            }
        });

        component.data = (new Function(`return ${this.attributes.data || '{}'}`)).call(component);
    }
});