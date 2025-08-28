
import { StyleRule } from "../style_rule.js";

StyleRule.register('P', {
    apply(){
        this.styles['padding'] = this.value;
    }
});