import test from 'node:test';
import assert from 'node:assert';

import { mappedViewNameFor } from './view_map.js';

test("mappedViewNameFor - no markers, identity", () => {
    assert.equal(mappedViewNameFor('foo'), 'foo');
});

test("mappedViewNameFor - suffix form", () => {
    assert.equal(mappedViewNameFor('foo--bar'), 'foo');
});

test("mappedViewNameFor - suffix form, nested", () => {
    assert.equal(mappedViewNameFor('foo--bar/baz'), 'foo/baz');
});

test("mappedViewNameFor - leading directory marker", () => {
    assert.equal(mappedViewNameFor('--bar/foo'), 'foo');
});

test("mappedViewNameFor - leading directory marker, nested", () => {
    assert.equal(mappedViewNameFor('--bar/foo/baz'), 'foo/baz');
});

test("mappedViewNameFor - middle directory marker", () => {
    assert.equal(mappedViewNameFor('foo/--bar/baz'), 'foo/baz');
});

test("mappedViewNameFor - trailing directory marker", () => {
    assert.equal(mappedViewNameFor('foo/--bar'), 'foo');
});

test("mappedViewNameFor - both forms combined", () => {
    assert.equal(mappedViewNameFor('foo--bar/--baz/qux'), 'foo/qux');
});
