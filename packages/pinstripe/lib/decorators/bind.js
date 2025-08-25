

import { Decorator } from '../decorator.js';

Decorator.register('bind', {
    decorate(){
        for(const [name, value] of Object.entries(this.attributes)){
            const matches = name.match(/^bind:(.+)$/);
            if(!matches) continue;
            const propName = matches[1];
            const dataComponent = this.component.find('parents', '[p-data]');
            if(!dataComponent) continue;
            this.component.manage(dataComponent.on('data:change', () => {
                this.component[propName] = dataComponent.data[value];
            }));
            this.component[propName] = dataComponent.data[value];
        }
    }
});
