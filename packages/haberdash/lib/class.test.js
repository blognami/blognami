import test from 'node:test';
import assert from 'node:assert';

import { Class } from "./class.js";

test('static bindProps binds methods to the class', () => {
    const Foo = Class.extend().include({
        meta(){
            this.assignProps({
                foo(){ return this; }
            });
        }
    });
    const { foo } = Foo.bindProps(['foo']);
    assert.strictEqual(foo(), Foo);
});

test('instance bindProps binds methods to the instance', async () => {
    const Foo = Class.extend().include({
        bar(){ return this; }
    });
    const instance = new Foo();
    const { bar } = instance.bindProps(['bar']);
    assert.strictEqual(bar(), instance);
});

test('bindProps throws when binding a name that does not exist', () => {
    const Foo = Class.extend();
    assert.throws(() => Foo.bindProps(['nonexistent']));
});
