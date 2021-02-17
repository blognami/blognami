
import { Base } from './base.js';

const pluralizeRules = [];
const singularizeRules = [];

const caseInsensitive = (string) => string.replace(/[a-z]/gi, (c) => `[${c.toUpperCase()}${c.toLowerCase()}]`);

export class Inflector extends Base {

    static ['dsl.plural'](...args){
        pluralizeRules.unshift(args);
    }

    static ['dsl.singular'](...args){
        singularizeRules.unshift(args);
    }

    static ['dsl.irregular'](singular, plural){
        const s0 = singular[0];
        const srest = singular.substr(1);

        const p0 = plural[0]
        const prest = plural.substr(1);

        if (s0.toUpperCase() == p0.toUpperCase()){
            this['dsl.plural'](new RegExp(`(${s0})${srest}$`, 'i'), `$1${prest}`);
            this['dsl.plural'](new RegExp(`(${p0})${prest}$`, 'i'), `$1${prest}`);

            this['dsl.singular'](new RegExp(`(${s0})${srest}$`, 'i'), `$1${srest}`);
            this['dsl.singular'](new RegExp(`(${p0})${prest}$`, 'i'), `$1${srest}`);
        } else {
            this['dsl.plural'](new RegExp(`${s0.toUpperCase()}${caseInsensitive(srest)}$`), `${p0.toUpperCase()}${prest}`);
            this['dsl.plural'](new RegExp(`${s0.toLowerCase()}${caseInsensitive(srest)}$`), `${p0.toLowerCase()}${prest}`);
            this['dsl.plural'](new RegExp(`${p0.toUpperCase()}${caseInsensitive(prest)}$`), `${p0.toUpperCase()}${prest}`);
            this['dsl.plural'](new RegExp(`${p0.toLowerCase()}${caseInsensitive(prest)}$`), `${p0.toLowerCase()}${prest}`);

            this['dsl.singular'](new RegExp(`${s0.toUpperCase()}${caseInsensitive(srest)}$`), `${s0.toUpperCase()}${srest}`);
            this['dsl.singular'](new RegExp(`${s0.toLowerCase()}${caseInsensitive(srest)}$`), `${s0.toLowerCase()}${srest}`);
            this['dsl.singular'](new RegExp(`${p0.toUpperCase()}${caseInsensitive(prest)}$`), `${s0.toUpperCase()}${srest}`);
            this['dsl.singular'](new RegExp(`${p0.toLowerCase()}${caseInsensitive(prest)}$`), `${s0.toLowerCase()}${srest}`);
        }
    }

    static ['dsl.uncountable'](singularAndPlural){
        this['dsl.irregular'](singularAndPlural, singularAndPlural);
    }

    static pluralize(word){
        word = `${word}`;
        for(let i in pluralizeRules){
            const [pattern, replacement] = pluralizeRules[i];
            if(word.match(pattern)){
                return word.replace(pattern, replacement);
            }
        }      
    }

    static singularize(word){
        word = `${word}`;
        for(let i in singularizeRules){
            const [pattern, replacement] = singularizeRules[i];
            if(word.match(pattern)){
                return word.replace(pattern, replacement);
            }
        }      
    }

    static snakeify(stringable){
        return `${stringable}`.split(/\//).map(segment =>
            segment.replace(/([A-Z])/g, '_$1').toLocaleLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '')
        ).join('/');
    }

    static dasherize(stringable){
        return this.snakeify(stringable).replace(/_/g, '-');
    }

    static capitalize(stringable){
        const [first, ...rest] = `${stringable}`;
        return `${first.toLocaleUpperCase()}${rest.join('')}`;
    }

    static uncapitalize(stringable){
        const [first, ...rest] = `${stringable}`;
        return `${first.toLocaleLowerCase()}${rest.join('')}`;
    }

    static pascalize(stringable){
        return this.snakeify(stringable).replace(/^[0-9]+/, '').split(/[^a-z0-9]+/).map(word => this.capitalize(word)).join('')
    }

    static camelize(stringable){
        return this.uncapitalize(this.pascalize(stringable));
    }

}

Inflector.define(dsl => dsl
    .plural(/$/, 's')
    .plural(/s$/i, 's')
    .plural(/^(ax|test)is$/i, '$1es')
    .plural(/(octop|vir)us$/i, '$1i')
    .plural(/(octop|vir)i$/i, '$1i')
    .plural(/(alias|status)$/i, '$1es')
    .plural(/(bu)s$/i, '$1ses')
    .plural(/(buffal|tomat)o$/i, '$1oes')
    .plural(/([ti])um$/i, '$1a')
    .plural(/([ti])a$/i, '$1a')
    .plural(/sis$/i, 'ses')
    .plural(/(?:([^f])fe|([lr])f)$/i, '$1$2ves')
    .plural(/(hive)$/i, '$1s')
    .plural(/([^aeiouy]|qu)y$/i, '$1ies')
    .plural(/(x|ch|ss|sh)$/i, '$1es')
    .plural(/(matr|vert|ind)(?:ix|ex)$/i, '$1ices')
    .plural(/^(m|l)ouse$/i, '$1ice')
    .plural(/^(m|l)ice$/i, '$1ice')
    .plural(/^(ox)$/i, '$1en')
    .plural(/^(oxen)$/i, '$1')
    .plural(/(quiz)$/i, '$1zes')

    .singular(/s$/i, '')
    .singular(/(ss)$/i, '$1')
    .singular(/(n)ews$/i, '$1ews')
    .singular(/([ti])a$/i, '$1um')
    .singular(/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)(sis|ses)$/i, '$1sis')
    .singular(/(^analy)(sis|ses)$/i, '$1sis')
    .singular(/([^f])ves$/i, '$1fe')
    .singular(/(hive)s$/i, '$1')
    .singular(/(tive)s$/i, '$1')
    .singular(/([lr])ves$/i, '$1f')
    .singular(/([^aeiouy]|qu)ies$/i, '$1y')
    .singular(/(s)eries$/i, '$1eries')
    .singular(/(m)ovies$/i, '$1ovie')
    .singular(/(x|ch|ss|sh)es$/i, '$1')
    .singular(/^(m|l)ice$/i, '$1ouse')
    .singular(/(bus)(es)?$/i, '$1')
    .singular(/(o)es$/i, '$1')
    .singular(/(shoe)s$/i, '$1')
    .singular(/(cris|test)(is|es)$/i, '$1is')
    .singular(/^(a)x[ie]s$/i, '$1xis')
    .singular(/(octop|vir)(us|i)$/i, '$1us')
    .singular(/(alias|status)(es)?$/i, '$1')
    .singular(/^(ox)en/i, '$1')
    .singular(/(vert|ind)ices$/i, '$1ex')
    .singular(/(matr)ices$/i, '$1ix')
    .singular(/(quiz)zes$/i, '$1')
    .singular(/(database)s$/i, '$1')

    .irregular('person', 'people')
    .irregular('man', 'men')
    .irregular('child', 'children')
    .irregular('sex', 'sexes')
    .irregular('move', 'moves')
    .irregular('zombie', 'zombies')

    .uncountable('equipment')
    .uncountable('information')
    .uncountable('rice')
    .uncountable('money')
    .uncountable('species')
    .uncountable('series')
    .uncountable('fish')
    .uncountable('sheep')
    .uncountable('jeans')
    .uncountable('police')
);
