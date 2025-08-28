import test from 'node:test';
import assert from 'node:assert';

import { StyleRule } from '../style_rule.js';
import './bg.js';

// test(`styleRule: bg`, () => {
//     assert.deepEqual(StyleRule.applyRules('bg-(yellow)'), { background: 'yellow' });
//     assert.deepEqual(StyleRule.applyRules("bg('yellow')"), { background: 'yellow' });
//     assert.deepEqual(StyleRule.applyRules('bg-#FFF'), { background: '#FFF' });
//     assert.deepEqual(StyleRule.applyRules('bg-(url("foo"))'), { background: 'url("foo")' });
//     assert.deepEqual(StyleRule.applyRules('bg-(rgb(123, 456, 789))'), { background: 'rgb(123, 456, 789)' });
//     assert.deepEqual(StyleRule.applyRules('bg-$primary-color'), { background: 'var(--primary-color)' });
// });
