
import { Decorator } from '../decorator.js';
import { StyleRule } from '../style_rule.js';
import { StyleModifier } from '../style_modifier.js';

import '../style_rules/index.js';

Decorator.register('style', {
    decorate(){
        const styles = {};
        for(const [name, value] of Object.entries(this.attributes)){
            const modifiers = name.replace(/^style:/, '').split(':');
            StyleRule.applyRules(value, styles);
        }
        console.log(`styles ${JSON.stringify(styles, null, 2)}`);
    },

    createCssSelector(){

    }        
});