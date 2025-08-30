import { murmur3 } from 'murmurhash-js';
import { ComponentDecorator } from '../component_decorator.js';
import { StyleDecorator } from '../style_decorator.js';
import { Style } from '../style.js';

import '../style_decorators/index.js';

ComponentDecorator.register('style', {
    decorate(){
        const style = Style.new(this.className);
        for(const [name, decorators] of Object.entries(this.attributes)){
            StyleDecorator.applyDecorators(decorators, style);
            const namespaceDecorators = name.replace(/^style(:|$)/, '').split(':').filter(Boolean).map(modifier => `@${modifier}`).join(';');
            StyleDecorator.applyDecorators(namespaceDecorators, style);
        }
        console.log(style.toString());
    },

    get className(){
        if(!this._className){
            this._className = `p-${murmur3(JSON.stringify(this.attributes)).toString(36)}`;
        }
        return this._className;
    }
});