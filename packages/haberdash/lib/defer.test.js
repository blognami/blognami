
import { defer } from './defer.js';


test('defer (1)', async () => {
    const hello = defer(() => (name = 'world') => `hello ${name}`);
    
    expect(await hello()).toBe("hello world");
    expect(await hello().length).toBe(11);
    expect(await hello('jody')).toBe("hello jody");
    expect(await hello('jody').length).toBe(10);
});

test('defer (2)', async () => {
    const foo = defer(() => ({
        async bar(){
            return this;
        },

        async baz(){
            return "boo";
        }
    }));
    
    expect(await foo.bar().baz()).toBe("boo");
    expect(await foo.bar().baz().length).toBe(3);
});

test('defer (3)', async () => {
    const foo = defer(() => ({
        toString(){
            return "hello world";
        }
    }));
    
    expect(await foo.toString()).toBe("hello world");
});

test('defer (4)', async () => {

    const { foo } = defer(() => ({}));
    
    expect(typeof await foo).toBe("undefined");

    expect(typeof await foo).toBe("undefined");
});

