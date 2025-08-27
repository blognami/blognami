
import { Decorator } from '../decorator.js';
import { StyleRule } from '../style_rule.js';
import { StyleModifier } from '../style_modifier.js';

import '../style_rules/index.js';

Decorator.register('style', {
    decorate(){
        
    },

    generateStyles(rules, modifiers) {
        const out = {};
        this.compileRules(rules).call(StyleRule, out);
        return out;
    }
});