import test from 'node:test';
import assert from 'node:assert';

import { LruCache } from './lru_cache.js';

test('LruCache (1)', () => {
    const cache = LruCache.extend().assignProps({
        maxEntries: 3
    }).new();

    cache.put('foo', 'apple');
    cache.put('bar', 'pear');
    cache.put('baz', 'plum');

    assert.equal(cache.index.length, 3);
    assert.deepEqual(cache.index.map(({ key }) => key), ['bar', 'baz', 'foo']);

    cache.put('boo', 'peach');
    
    assert.equal(cache.index.length, 3);
    assert.deepEqual(cache.index.map(({ key }) => key), ['bar', 'baz', 'boo']);
    assert.equal(cache.get('foo'), undefined);
    
});

test('LruCache (2)', () => {
    const cache = LruCache.extend().assignProps({
        maxEntries: 3
    }).new();

    cache.put('foo', 'apple');
    cache.put('bar', 'pear');
    cache.put('baz', 'plum');

    assert.equal(cache.index.length, 3);
    assert.deepEqual(cache.index.map(({ key }) => key), ['bar', 'baz', 'foo']);
    assert.equal(cache.get('foo'), 'apple');

    cache.put('boo', 'peach');
    
    assert.equal(cache.index.length, 3);
    assert.deepEqual(cache.index.map(({ key }) => key), ['bar', 'foo', 'boo']);
    assert.equal(cache.get('foo'), 'apple');
    assert.deepEqual(cache.index.map(({ key }) => key), ['foo', 'bar', 'boo']);
    assert.equal(cache.get('foo'), 'apple');
    assert.deepEqual(cache.index.map(({ key }) => key), ['foo', 'bar', 'boo']);
});