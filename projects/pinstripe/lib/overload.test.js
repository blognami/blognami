
import { overload } from './overload.js';

[
    {
        fn: overload({
            boolean(){
                return 'boolean';
            },
    
            number(){
                return 'number';
            },
    
            string(){
                return 'string';
            },
    
            object(){
                return 'object';
            },
    
            array(){
                return 'array';
            },
    
            function(){
                return 'function';
            },
        }),
        assertions: [
            { args: [ true ], out: 'boolean' },
            { args: [ false ], out: 'boolean' },
            { args: [ 5 ], out: 'number' },
            { args: [ 'Hello World!' ], out: 'string' },
            { args: [ {} ], out: 'object' },
            { args: [ [] ], out: 'array' },
            { args: [ () => {} ], out: 'function' },
            { args: [ 'string', () => {} ], exceptionMessage: 'Could not satisfy overloaded function (string, function).' },
            { args: [], exceptionMessage: 'Could not satisfy overloaded function ().' }
        ]
    },

    {
        fn: overload({
            ['boolean'](){
                return 'boolean';
            },

            ['boolean, number'](){
                return 'boolean, number';
            },

            ['boolean, number, string'](){
                return 'boolean, number, string';
            },

            ['boolean, number, string, object'](){
                return 'boolean, number, string, object';
            },

            ['boolean, number, string, object, array'](){
                return 'boolean, number, string, object, array';
            },

            ['boolean, number, string, object, array, function'](){
                return 'boolean, number, string, object, array, function';
            },

            ['boolean, number, string, object, array, function, bigint'](){
                return 'boolean, number, string, object, array, function, bigint';
            },
        }),

        assertions: [
            { args: [ true ], out: 'boolean' },
            { args: [ false, 42 ], out: 'boolean, number' },
            { args: [ true, 7, 'foo' ], out: 'boolean, number, string' },
            { args: [ false, 57, 'bar', {} ], out: 'boolean, number, string, object' },
            { args: [ true, 498, 'baz', { test: 123 }, [56] ], out: 'boolean, number, string, object, array' },
            { args: [ true, 498, 'baz', { test: 123 }, [56], () => {} ], out: 'boolean, number, string, object, array, function' },
            { args: [ true, 498, 'baz', { test: 123 }, [56], () => {}, BigInt(1001) ], out: 'boolean, number, string, object, array, function, bigint' },
            { args: [ true, 498, 'baz', { test: 123 }, [56], () => {}, 32], exceptionMessage: 'Could not satisfy overloaded function (boolean, number, string, object, array, function, number).' },
        ]
    },

    {
        fn: overload({
            boolean(){
                return 'boolean';
            },

            ['boolean, number'](){
                return 'boolean, number'
            },

            ['boolean, ...'](){
                return 'boolean, ...';
            }
        }),

        assertions: [
            { args: [ true ], out: 'boolean' },
            { args: [ false, 46 ], out: 'boolean, number' },
            { args: [ false, 'foo' ], out: 'boolean, ...' },
            { args: [ 'bar' ], exceptionMessage: 'Could not satisfy overloaded function (string).'},
        ]
    },

    {
        fn: overload({
            any(){
                return 'any';
            }
        }),

        assertions: [
            { args: [ true ], out: 'any' },
            { args: [ false ], out: 'any' },
            { args: [ 'foo' ], out: 'any' },
            { args: [ 3 ], out: 'any' },
            { args: [ BigInt(42) ], out: 'any' },
            { args: [ {} ], out: 'any' },
            { args: [ [] ], out: 'any' },
            { args: [ () => {} ], out: 'any' },
            { args: [], exceptionMessage: 'Could not satisfy overloaded function ().'},
            { args: [ 'bar', 'foo' ], exceptionMessage: 'Could not satisfy overloaded function (string, string).'},
        ]
    }
].forEach(({ fn, assertions }, i) => {
    test(`overload (1) [${i}]`, () => {
        assertions.forEach(({ args, out, exceptionMessage }) => {
            if(exceptionMessage){
                expect(() => fn(...args)).toThrow(exceptionMessage);
            } else {
                expect(fn(...args)).toBe(out);
            }
        });
    });
});

test(`overload (2)`, () => {
    const o = {
        foo: overload({
            boolean(){
                return 'boolean';
            }
        })
    }

    expect(o.foo(true)).toBe('boolean');
    expect(() => o.foo('string')).toThrow('Could not satisfy overloaded method foo(string).');
});