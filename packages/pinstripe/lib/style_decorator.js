
import { Class } from './class.js';
import { Registry } from './registry.js';

export const StyleDecorator = Class.extend().include({
    meta(){
        this.include(Registry);

        this.assignProps({
            applyDecorators(decorators, styles = {}){
                this.compileDecorators(decorators).call(this, styles);
                return styles;
            },

            compileDecorators(decorators){
                const cacheKey = `compiledDecorators:${decorators}`;
                if(!this.cache[cacheKey]){
                    const parsedRules = this.parseDecorators(decorators);
                    const normalizedRules = this.normalizeDecorators(parsedRules);
                    this.cache[cacheKey] = new Function('styles', normalizedRules.map(({ name, value }) => `this.create(${JSON.stringify(name)}, styles, ${JSON.stringify(value)}).apply()`).join('; '));
                }
                return this.cache[cacheKey];
            },

            parseDecorators(decorators){
                const out = [];
                const tokens = decorators.split('');
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

            normalizeDecorators(decorators){
                const out = [];
                for (const rule of decorators) {
                    const matches = rule.match(/^([\w-]+):\s*(.*)$/);
                    if (matches) {
                        out.push({ name: matches[1], value: matches[2] });
                        continue;
                    }
                    out.push({ name: rule, value: '' });
                }
                return out;
            }
        });
    },

    initialize(styles, value){
        this.styles = styles;
        this.value = value;
    },

    apply(){
        this.styles[this.constructor.name] = this.value;
    }
});

