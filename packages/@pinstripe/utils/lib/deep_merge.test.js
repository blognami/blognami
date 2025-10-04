import { test } from 'node:test';
import assert from 'node:assert';
import { deepMerge } from './deep_merge.js';

test('deepMerge - basic object merging', () => {
  const target = { a: 1, b: 2 };
  const source = { b: 3, c: 4 };
  
  deepMerge(target, source);
  
  assert.deepStrictEqual(target, { a: 1, b: 3, c: 4 });
});

test('deepMerge - nested object merging', () => {
  const target = { 
    a: 1, 
    nested: { x: 1, y: 2 } 
  };
  const source = { 
    b: 2, 
    nested: { y: 3, z: 4 } 
  };
  
  deepMerge(target, source);
  
  assert.deepStrictEqual(target, { 
    a: 1, 
    b: 2, 
    nested: { x: 1, y: 3, z: 4 } 
  });
});

test('deepMerge - arrays are replaced entirely, not merged', () => {
  const target = { 
    categories: ['old1', 'old2'],
    other: 'value'
  };
  const source = { 
    categories: ['new1', 'new2', 'new3'] 
  };
  
  deepMerge(target, source);
  
  assert.deepStrictEqual(target, { 
    categories: ['new1', 'new2', 'new3'],
    other: 'value'
  });
  
  // Verify it's still an actual array
  assert.strictEqual(Array.isArray(target.categories), true);
  assert.strictEqual(target.categories.length, 3);
});

test('deepMerge - sidebar category array case (the original bug)', () => {
  const target = {};
  const source = { 
    sidebar: {
      category: ['Services', 'serviceWorker']
    }
  };
  
  deepMerge(target, source);
  
  // This should NOT convert the array to { '0': 'Services', '1': 'serviceWorker' }
  assert.deepStrictEqual(target, { 
    sidebar: {
      category: ['Services', 'serviceWorker']
    }
  });
  
  // Verify it's still an actual array
  assert.strictEqual(Array.isArray(target.sidebar.category), true);
  assert.strictEqual(target.sidebar.category[0], 'Services');
  assert.strictEqual(target.sidebar.category[1], 'serviceWorker');
});

test('deepMerge - mixed nested objects and arrays', () => {
  const target = {
    config: {
      tags: ['tag1'],
      settings: { debug: false }
    }
  };
  const source = {
    config: {
      tags: ['tag2', 'tag3'],
      settings: { debug: true, verbose: true },
      newField: 'value'
    }
  };
  
  deepMerge(target, source);
  
  assert.deepStrictEqual(target, {
    config: {
      tags: ['tag2', 'tag3'], // Array replaced entirely
      settings: { debug: true, verbose: true }, // Object merged
      newField: 'value'
    }
  });
  
  assert.strictEqual(Array.isArray(target.config.tags), true);
});

test('deepMerge - null and undefined handling', () => {
  const target = { a: 1, b: null };
  const source = { b: { nested: 'value' }, c: null };
  
  deepMerge(target, source);
  
  assert.deepStrictEqual(target, { 
    a: 1, 
    b: { nested: 'value' }, 
    c: null 
  });
});

test('deepMerge - empty arrays', () => {
  const target = { items: ['existing'] };
  const source = { items: [] };
  
  deepMerge(target, source);
  
  assert.deepStrictEqual(target, { items: [] });
  assert.strictEqual(Array.isArray(target.items), true);
});

test('deepMerge - target has array, source has object', () => {
  const target = { field: ['array', 'items'] };
  const source = { field: { prop: 'value' } };
  
  deepMerge(target, source);
  
  assert.deepStrictEqual(target, { field: { prop: 'value' } });
});

test('deepMerge - target has object, source has array', () => {
  const target = { field: { prop: 'value' } };
  const source = { field: ['array', 'items'] };
  
  deepMerge(target, source);
  
  assert.deepStrictEqual(target, { field: ['array', 'items'] });
  assert.strictEqual(Array.isArray(target.field), true);
});

test('deepMerge - deeply nested arrays', () => {
  const target = {};
  const source = {
    level1: {
      level2: {
        level3: {
          categories: ['Services', 'database', 'utils']
        }
      }
    }
  };
  
  deepMerge(target, source);
  
  assert.deepStrictEqual(target, source);
  assert.strictEqual(Array.isArray(target.level1.level2.level3.categories), true);
});

test('deepMerge - array with objects inside', () => {
  const target = {};
  const source = {
    items: [
      { id: 1, name: 'item1' },
      { id: 2, name: 'item2' }
    ]
  };
  
  deepMerge(target, source);
  
  assert.deepStrictEqual(target, source);
  assert.strictEqual(Array.isArray(target.items), true);
  assert.strictEqual(typeof target.items[0], 'object');
  assert.strictEqual(target.items[0].id, 1);
});