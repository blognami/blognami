import test from 'node:test';
import assert from 'node:assert';

import { StyleRule } from '../style_rule.js';
import './P.js';

test(`styleRule: P`, () => {
    assert.deepEqual(StyleRule.applyRules('P: 1px'), { padding: '1px' });
});
