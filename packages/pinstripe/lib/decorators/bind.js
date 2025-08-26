

import { Decorator } from '../decorator.js';

Decorator.register('bind', {
    decorate(){
        const { component } = this;

        const dataComponent = component.find('parentsIncludingThis', '[p-data]');
        if(!dataComponent) return;

        if(this.attributes.bind) {
            const fn = new Function(this.attributes.bind);
            component.manage(dataComponent.on('data:change', () => {
                fn.call(component);
            }));
            fn.call(component);
        }

        for(const [name, value] of Object.entries(this.attributes)){
            const matches = name.match(/^bind:(.+)$/);
            if(!matches) continue;
            const path = matches[1].split(':');
            const fn = new Function(`this${path.map(item => `[${JSON.stringify(item)}]`).join('')} = this.data.${value}`);
            component.manage(dataComponent.on('data:change', () => {
                fn.call(component);
            }));
            fn.call(component);
        }
    }
});
