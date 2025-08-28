import test from 'node:test';
import assert from 'node:assert';

import { StyleRule } from './style_rule.js';

test(`StyleRule.parseRules`, () => {
    assert.deepEqual(StyleRule.parseRules(''), []);
    assert.deepEqual(StyleRule.parseRules(' '), []);
    assert.deepEqual(StyleRule.parseRules('  '), []);

    // Single rules
    assert.deepEqual(StyleRule.parseRules('background: yellow'), ['background: yellow']);
    assert.deepEqual(StyleRule.parseRules('background: yellow;'), ['background: yellow']);
    assert.deepEqual(StyleRule.parseRules('background: yellow '), ['background: yellow']);
    assert.deepEqual(StyleRule.parseRules('background: yellow; '), ['background: yellow']);
    assert.deepEqual(StyleRule.parseRules(' background: yellow; '), ['background: yellow']);
    assert.deepEqual(StyleRule.parseRules(' background: yellow ; '), ['background: yellow']);

    // Multiple rules
    assert.deepEqual(StyleRule.parseRules('background: yellow; color: blue'), ['background: yellow', 'color: blue']);
    assert.deepEqual(StyleRule.parseRules('background: yellow ; color: blue'), ['background: yellow', 'color: blue']);
    assert.deepEqual(StyleRule.parseRules(' background: yellow  ;  color: blue '), ['background: yellow', 'color: blue']);
    assert.deepEqual(StyleRule.parseRules('background: rgb(123, 456, 789); color: blue'), ['background: rgb(123, 456, 789)', 'color: blue']);
    assert.deepEqual(StyleRule.parseRules('background: url("foo;bar"); color: blue'), ['background: url("foo;bar")', 'color: blue']);
    assert.deepEqual(StyleRule.parseRules('background: url(\'foo;bar\'); color: blue'), ['background: url(\'foo;bar\')', 'color: blue']);

    // Other
    assert.deepEqual(StyleRule.parseRules('background: url("foo;bar"); P; color: blue;'), ['background: url("foo;bar")', 'P', 'color: blue']);
});

test(`StyleRule.normalizeRules`, () => {
    assert.deepEqual(StyleRule.normalizeRules([]), []);
    assert.deepEqual(StyleRule.normalizeRules(['background: yellow']), [{name: 'background', value: 'yellow'}]);
    assert.deepEqual(StyleRule.normalizeRules(['background: rgb(123, 456, 789)']), [{name: 'background', value: 'rgb(123, 456, 789)'}]);
    assert.deepEqual(StyleRule.normalizeRules(['background: url("foo;bar")']), [{name: 'background', value: 'url("foo;bar")'}]);
    assert.deepEqual(StyleRule.normalizeRules(['P']), [{name: 'P', value: ''}]);
    assert.deepEqual(StyleRule.normalizeRules(['color: blue']), [{name: 'color', value: 'blue'}]);
});

test(`StyleRule.compileRules`, () => {
    const createStub = () => ({
        calls: [],
        styles: {},
        create(...value){
            this.calls.push(['create', ...value]);
            return this;
        },
        apply(){
            this.calls.push(['apply']);
        }
    });

    let stub = createStub();
    StyleRule.compileRules('background: yellow').call(stub, 'STUB_STYLES');
    assert.deepEqual(stub.calls, [
        ['create', 'background', 'STUB_STYLES', 'yellow'],
        ['apply']
    ]);
    
    stub = createStub();
    StyleRule.compileRules('background: rgb(123, 456, 789); P; color: blue').call(stub, 'STUB_STYLES');
    assert.deepEqual(stub.calls, [
        ['create', 'background', 'STUB_STYLES', 'rgb(123, 456, 789)'], ['apply'],
        ['create', 'P', 'STUB_STYLES', ''], ['apply'],
        ['create', 'color', 'STUB_STYLES', 'blue'], ['apply']
    ]);
});

test(`StyleRule.applyRules`, () => {
    assert.deepEqual(StyleRule.applyRules('background: yellow'), { background: 'yellow' });
    assert.deepEqual(StyleRule.applyRules('background: rgb(123, 456, 789); color: blue'), { background: 'rgb(123, 456, 789)', color: 'blue' });
    assert.deepEqual(StyleRule.applyRules('background: url("foo;bar"); color: blue'), { background: 'url("foo;bar")', color: 'blue' });
    assert.deepEqual(StyleRule.applyRules('background: url(\'foo;bar\'); color: blue'), { background: "url('foo;bar')", color: 'blue' });
});

