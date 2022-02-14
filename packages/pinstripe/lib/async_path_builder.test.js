
import { AsyncPathBuilder } from './async_path_builder.js';

test('AsyncPathBuilder (1)', async () => {
    const hello = AsyncPathBuilder.new((name = 'world') => `hello ${name}`);
    
    expect(hello instanceof AsyncPathBuilder).toBe(true);
    expect(await hello()).toBe("hello world");
    expect(await hello().length).toBe(11);
    expect(await hello('jody')).toBe("hello jody");
    expect(await hello('jody').length).toBe(10);
});

test('AsyncPathBuilder (2)', async () => {
    const foo = AsyncPathBuilder.new({
        async bar(){
            return this;
        },

        async baz(){
            return "boo";
        }
    });
    
    expect(await foo.bar().baz()).toBe("boo");
    expect(await foo.bar().baz().length).toBe(3);
});

test('AsyncPathBuilder (3)', async () => {
    const foo = AsyncPathBuilder.new({
        toString(){
            return "hello world";
        }
    });
    
    expect(await foo.toString()).toBe("hello world");
});

