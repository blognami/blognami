import test from 'node:test';
import assert from 'node:assert';

import { StyleDecorator } from '../style_decorator.js';
import './P.js';

test(`styleRule: P`, () => {
    assert.deepEqual(StyleDecorator.applyRules('P: 1px'), { padding: '1px' });
});
