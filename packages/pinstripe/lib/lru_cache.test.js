
import { LruCache } from './lru_cache.js';

test('LruCache (1)', () => {
    const cache = LruCache.extend().assignProps({
        maxEntries: 3
    }).new();

    cache.put('foo', 'apple');
    cache.put('bar', 'pear');
    cache.put('baz', 'plum');

    expect(cache.index.length).toBe(3);
    expect(cache.index.map(({ key }) => key)).toStrictEqual(['bar', 'baz', 'foo']);

    cache.put('boo', 'peach');
    
    expect(cache.index.length).toBe(3);
    expect(cache.index.map(({ key }) => key)).toStrictEqual(['bar', 'baz', 'boo']);
    expect(cache.get('foo')).toBe(undefined);
    
});

test('LruCache (2)', () => {
    const cache = LruCache.extend().assignProps({
        maxEntries: 3
    }).new();

    cache.put('foo', 'apple');
    cache.put('bar', 'pear');
    cache.put('baz', 'plum');

    expect(cache.index.length).toBe(3);
    expect(cache.index.map(({ key }) => key)).toStrictEqual(['bar', 'baz', 'foo']);
    expect(cache.get('foo')).toBe('apple');

    cache.put('boo', 'peach');
    
    expect(cache.index.length).toBe(3);
    expect(cache.index.map(({ key }) => key)).toStrictEqual(['bar', 'foo', 'boo']);
    expect(cache.get('foo')).toBe('apple');
    expect(cache.index.map(({ key }) => key)).toStrictEqual(['foo', 'bar', 'boo']);
    expect(cache.get('foo')).toBe('apple');
    expect(cache.index.map(({ key }) => key)).toStrictEqual(['foo', 'bar', 'boo']);
});