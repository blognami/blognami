
import { StyleRule } from "../style_rule.js";

StyleRule.register('bg', {
    apply(){
        let [ value ] = this.args;
        value = `${value}`;
        const matches = value.match(/^\$(.+)$/);
        if(matches){
            value = `var(--${matches[1]})`;
        }
        this.styles['background'] = value;
    }
});