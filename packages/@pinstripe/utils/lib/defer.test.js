
import test from 'node:test';
import assert from 'node:assert';

import { defer } from './defer.js';

test('defer (1)', async () => {
    const hello = defer(() => (name = 'world') => `hello ${name}`);
    
    assert.equal(await hello(), "hello world");
    assert.equal(await hello().length, 11);
    assert.equal(await hello('jody'), "hello jody");
    assert.equal(await hello('jody').length, 10);
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
    
    assert.equal(await foo.bar().baz(), "boo");
    assert.equal(await foo.bar().baz().length, 3);
});

test('defer (3)', async () => {
    const foo = defer(() => ({
        toString(){
            return "hello world";
        }
    }));
    
    assert.equal(await foo.toString(), "hello world");
});

test('defer (4)', async () => {

    const { foo } = defer(() => ({}));
    
    assert.equal(typeof await foo, "undefined");

    assert.equal(typeof await foo, "undefined");
});

