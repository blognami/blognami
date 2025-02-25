
import { Class } from "./class.js";
import { Singleton } from "./singleton.js";

export const Inflector = Class.extend().include({
    meta(){
        this.include(Singleton);
        
        this.assignProps({
            pluralizeRules: [],

            singularizeRules: [],

            definePlural(...args){
                this.pluralizeRules.unshift(args);
            },
            
            defineSingular(...args){
                this.singularizeRules.unshift(args);
            },
            
            defineIrregular(singular, plural){
                const s0 = singular[0];
                const srest = singular.substr(1);
            
                const p0 = plural[0]
                const prest = plural.substr(1);
            
                if (s0.toUpperCase() == p0.toUpperCase()){
                    this.definePlural(new RegExp(`(${s0})${srest}$`, 'i'), `$1${prest}`);
                    this.definePlural(new RegExp(`(${p0})${prest}$`, 'i'), `$1${prest}`);
            
                    this.defineSingular(new RegExp(`(${s0})${srest}$`, 'i'), `$1${srest}`);
                    this.defineSingular(new RegExp(`(${p0})${prest}$`, 'i'), `$1${srest}`);
                } else {
                    this.definePlural(new RegExp(`${s0.toUpperCase()}${caseInsensitive(srest)}$`), `${p0.toUpperCase()}${prest}`);
                    this.definePlural(new RegExp(`${s0.toLowerCase()}${caseInsensitive(srest)}$`), `${p0.toLowerCase()}${prest}`);
                    this.definePlural(new RegExp(`${p0.toUpperCase()}${caseInsensitive(prest)}$`), `${p0.toUpperCase()}${prest}`);
                    this.definePlural(new RegExp(`${p0.toLowerCase()}${caseInsensitive(prest)}$`), `${p0.toLowerCase()}${prest}`);
            
                    this.defineSingular(new RegExp(`${s0.toUpperCase()}${caseInsensitive(srest)}$`), `${s0.toUpperCase()}${srest}`);
                    this.defineSingular(new RegExp(`${s0.toLowerCase()}${caseInsensitive(srest)}$`), `${s0.toLowerCase()}${srest}`);
                    this.defineSingular(new RegExp(`${p0.toUpperCase()}${caseInsensitive(prest)}$`), `${s0.toUpperCase()}${srest}`);
                    this.defineSingular(new RegExp(`${p0.toLowerCase()}${caseInsensitive(prest)}$`), `${s0.toLowerCase()}${srest}`);
                }
            },
            
            defineUncountable(singularAndPlural){
                this.defineIrregular(singularAndPlural, singularAndPlural);
            },

            inflect(...args){
                return this.singleton.inflect(...args);
            }
        });

        this.definePlural(/$/, 's');
        this.definePlural(/s$/i, 's');
        this.definePlural(/^(ax|test)is$/i, '$1es');
        this.definePlural(/(octop|vir)us$/i, '$1i');
        this.definePlural(/(octop|vir)i$/i, '$1i');
        this.definePlural(/(alias|status)$/i, '$1es');
        this.definePlural(/(bu)s$/i, '$1ses');
        this.definePlural(/(buffal|tomat)o$/i, '$1oes');
        this.definePlural(/([ti])um$/i, '$1a');
        this.definePlural(/([ti])a$/i, '$1a');
        this.definePlural(/sis$/i, 'ses');
        this.definePlural(/(?:([^f])fe|([lr])f)$/i, '$1$2ves');
        this.definePlural(/(hive)$/i, '$1s');
        this.definePlural(/([^aeiouy]|qu)y$/i, '$1ies');
        this.definePlural(/(x|ch|ss|sh)$/i, '$1es');
        this.definePlural(/(matr|vert|ind)(?:ix|ex)$/i, '$1ices');
        this.definePlural(/^(m|l)ouse$/i, '$1ice');
        this.definePlural(/^(m|l)ice$/i, '$1ice');
        this.definePlural(/^(ox)$/i, '$1en');
        this.definePlural(/^(oxen)$/i, '$1');
        this.definePlural(/(quiz)$/i, '$1zes');

        this.defineSingular(/s$/i, '');
        this.defineSingular(/(ss)$/i, '$1');
        this.defineSingular(/(n)ews$/i, '$1ews');
        this.defineSingular(/([ti])a$/i, '$1um');
        this.defineSingular(/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)(sis|ses)$/i, '$1sis');
        this.defineSingular(/(^analy)(sis|ses)$/i, '$1sis');
        this.defineSingular(/([^f])ves$/i, '$1fe');
        this.defineSingular(/(hive)s$/i, '$1');
        this.defineSingular(/(tive)s$/i, '$1');
        this.defineSingular(/([lr])ves$/i, '$1f');
        this.defineSingular(/([^aeiouy]|qu)ies$/i, '$1y');
        this.defineSingular(/(s)eries$/i, '$1eries');
        this.defineSingular(/(m)ovies$/i, '$1ovie');
        this.defineSingular(/(x|ch|ss|sh)es$/i, '$1');
        this.defineSingular(/^(m|l)ice$/i, '$1ouse');
        this.defineSingular(/(bus)(es)?$/i, '$1');
        this.defineSingular(/(o)es$/i, '$1');
        this.defineSingular(/(shoe)s$/i, '$1');
        this.defineSingular(/(cris|test)(is|es)$/i, '$1is');
        this.defineSingular(/^(a)x[ie]s$/i, '$1xis');
        this.defineSingular(/(octop|vir)(us|i)$/i, '$1us');
        this.defineSingular(/(alias|status)(es)?$/i, '$1');
        this.defineSingular(/^(ox)en/i, '$1');
        this.defineSingular(/(vert|ind)ices$/i, '$1ex');
        this.defineSingular(/(matr)ices$/i, '$1ix');
        this.defineSingular(/(quiz)zes$/i, '$1');
        this.defineSingular(/(database)s$/i, '$1');

        this.defineIrregular('person', 'people');
        this.defineIrregular('man', 'men');
        this.defineIrregular('child', 'children');
        this.defineIrregular('sex', 'sexes');
        this.defineIrregular('move', 'moves');
        this.defineIrregular('zombie', 'zombies');

        this.defineUncountable('equipment');
        this.defineUncountable('information');
        this.defineUncountable('rice');
        this.defineUncountable('money');
        this.defineUncountable('species');
        this.defineUncountable('series');
        this.defineUncountable('fish');
        this.defineUncountable('sheep');
        this.defineUncountable('jeans');
        this.defineUncountable('police');
    },

    inflect(value, ...steps){
        return steps.reduce((previousValue, currentValue) => {
            const normalizedCurrentValue = Array.isArray(currentValue) ? currentValue : [ currentValue ];
            const [ methodName, ...args ] = normalizedCurrentValue;
            return this[methodName](previousValue, ...args);
        }, value);
    },
    
    pluralize(word){
        word = `${word}`;
        for(let i in this.constructor.pluralizeRules){
            const [pattern, replacement] = this.constructor.pluralizeRules[i];
            if(word.match(pattern)){
                return word.replace(pattern, replacement);
            }
        }      
    },
    
    singularize(word){
        word = `${word}`;
        for(let i in this.constructor.singularizeRules){
            const [pattern, replacement] = this.constructor.singularizeRules[i];
            if(word.match(pattern)){
                return word.replace(pattern, replacement);
            }
        }      
    },
    
    snakeify(stringable){
        return `${stringable}`.split(/\//).map(segment =>
            segment.replace(/([A-Z])/g, '_$1').toLocaleLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '')
        ).join('/');
    },
    
    dasherize(stringable){
        return this.snakeify(stringable).replace(/_/g, '-');
    },
    
    capitalize(stringable){
        const [first, ...rest] = `${stringable}`;
        return `${first.toLocaleUpperCase()}${rest.join('')}`;
    },
    
    uncapitalize(stringable){
        const [first, ...rest] = `${stringable}`;
        return `${first.toLocaleLowerCase()}${rest.join('')}`;
    },
    
    pascalize(stringable){
        return this.snakeify(stringable).replace(/^[0-9]+/, '').split(/[^a-z0-9]+/).map(word => this.capitalize(word)).join('');
    },
    
    camelize(stringable){
        return this.uncapitalize(this.pascalize(stringable));
    },

    titleize(stringable){
        return this.snakeify(stringable).split(/_/).map(word => this.capitalize(word)).join(' ');
    },

    humanize(stringable){
        return this.capitalize(this.snakeify(stringable).split(/_/).join(' '));
    }
});

const caseInsensitive = (string) => string.replace(/[a-z]/gi, (c) => `[${c.toUpperCase()}${c.toLowerCase()}]`);

export const inflector = Inflector.instance;
