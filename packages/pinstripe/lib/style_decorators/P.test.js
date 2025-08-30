import test from 'node:test';
import assert from 'node:assert';

import { StyleDecorator } from '../style_decorator.js';
import './P.js';

test(`styleRule: P`, () => {
    assert.deepEqual(StyleDecorator.applyDecorators('P: 1px').properties, { padding: '1px' });
});
