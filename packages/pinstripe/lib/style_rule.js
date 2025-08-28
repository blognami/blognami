
import { Class } from './class.js';
import { Registry } from './registry.js';

export const StyleRule = Class.extend().include({
    meta(){
        this.include(Registry);

        this.assignProps({
            applyRules(rules, styles = {}){
                this.compileRules(rules).call(this, styles);
                return styles;
            },

            compileRules(rules){
                const cacheKey = `compiledRules:${rules}`;
                if(!this.cache[cacheKey]){
                    const parsedRules = this.parseRules(rules);
                    const normalizedRules = this.normalizeRules(parsedRules);
                    this.cache[cacheKey] = new Function('styles', normalizedRules.map(({ name, args }) => `this.create(${JSON.stringify(name)}, styles${args ? `, ${args}` : ''}).apply()`).join('; '));
                }
                return this.cache[cacheKey];
            },

            parseRules(rules){
                const out = [];
                const tokens = rules.split('');
                let bracketLevel = 0;
                let buffer = [];

                while (tokens.length > 0) {
                    const token = tokens.shift();

                    if (token === '(') {
                        bracketLevel++;
                    }

                    if (token === ')') {
                        bracketLevel--;
                    }

                    if(token == '\\'){
                        buffer.push(token);
                        if(tokens.length > 0){
                            buffer.push(tokens.shift());
                        }
                        continue;
                    }

                    buffer.push(token);

                    if (bracketLevel === 0 && buffer.length > 0 && (token == ';' || tokens.length == 0)) {
                        const rule = buffer.join('').replace(/^\s*|;\s*$/g, '').trim();
                        if (rule.length > 0) {
                            out.push(rule);
                        }
                        buffer = [];
                    }
                }

                return out;
            },

            normalizeRules(rules){
                const out = [];
                for (const rule of rules) {
                    const matches = rule.match(/^([\w-]+):\s*(.*)$/);
                    if (matches) {
                        out.push({ name: matches[1], args: matches[2] });
                        continue;
                    }
                    out.push({ name: rule, args: '' });
                }
                return out;
            }
        });
    },

    initialize(styles, ...args){
        this.styles = styles;
        this.args = args;
    },

    apply(){

    }
});

