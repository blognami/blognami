import test from 'node:test';
import assert from 'node:assert';

import { StyleDecorator } from './style_decorator.js';

test(`StyleDecorator.parseRules`, () => {
    assert.deepEqual(StyleDecorator.parseRules(''), []);
    assert.deepEqual(StyleDecorator.parseRules(' '), []);
    assert.deepEqual(StyleDecorator.parseRules('  '), []);

    // Single rules
    assert.deepEqual(StyleDecorator.parseRules('background: yellow'), ['background: yellow']);
    assert.deepEqual(StyleDecorator.parseRules('background: yellow;'), ['background: yellow']);
    assert.deepEqual(StyleDecorator.parseRules('background: yellow '), ['background: yellow']);
    assert.deepEqual(StyleDecorator.parseRules('background: yellow; '), ['background: yellow']);
    assert.deepEqual(StyleDecorator.parseRules(' background: yellow; '), ['background: yellow']);
    assert.deepEqual(StyleDecorator.parseRules(' background: yellow ; '), ['background: yellow']);

    // Multiple rules
    assert.deepEqual(StyleDecorator.parseRules('background: yellow; color: blue'), ['background: yellow', 'color: blue']);
    assert.deepEqual(StyleDecorator.parseRules('background: yellow ; color: blue'), ['background: yellow', 'color: blue']);
    assert.deepEqual(StyleDecorator.parseRules(' background: yellow  ;  color: blue '), ['background: yellow', 'color: blue']);
    assert.deepEqual(StyleDecorator.parseRules('background: rgb(123, 456, 789); color: blue'), ['background: rgb(123, 456, 789)', 'color: blue']);
    assert.deepEqual(StyleDecorator.parseRules('background: url("foo;bar"); color: blue'), ['background: url("foo;bar")', 'color: blue']);
    assert.deepEqual(StyleDecorator.parseRules('background: url(\'foo;bar\'); color: blue'), ['background: url(\'foo;bar\')', 'color: blue']);

    // Other
    assert.deepEqual(StyleDecorator.parseRules('background: url("foo;bar"); P; color: blue;'), ['background: url("foo;bar")', 'P', 'color: blue']);
});

test(`StyleDecorator.normalizeRules`, () => {
    assert.deepEqual(StyleDecorator.normalizeRules([]), []);
    assert.deepEqual(StyleDecorator.normalizeRules(['background: yellow']), [{name: 'background', value: 'yellow'}]);
    assert.deepEqual(StyleDecorator.normalizeRules(['background: rgb(123, 456, 789)']), [{name: 'background', value: 'rgb(123, 456, 789)'}]);
    assert.deepEqual(StyleDecorator.normalizeRules(['background: url("foo;bar")']), [{name: 'background', value: 'url("foo;bar")'}]);
    assert.deepEqual(StyleDecorator.normalizeRules(['P']), [{name: 'P', value: ''}]);
    assert.deepEqual(StyleDecorator.normalizeRules(['color: blue']), [{name: 'color', value: 'blue'}]);
});

test(`StyleDecorator.compileRules`, () => {
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
    StyleDecorator.compileRules('background: yellow').call(stub, 'STUB_STYLES');
    assert.deepEqual(stub.calls, [
        ['create', 'background', 'STUB_STYLES', 'yellow'],
        ['apply']
    ]);
    
    stub = createStub();
    StyleDecorator.compileRules('background: rgb(123, 456, 789); P; color: blue').call(stub, 'STUB_STYLES');
    assert.deepEqual(stub.calls, [
        ['create', 'background', 'STUB_STYLES', 'rgb(123, 456, 789)'], ['apply'],
        ['create', 'P', 'STUB_STYLES', ''], ['apply'],
        ['create', 'color', 'STUB_STYLES', 'blue'], ['apply']
    ]);
});

test(`StyleDecorator.applyRules`, () => {
    assert.deepEqual(StyleDecorator.applyRules('background: yellow'), { background: 'yellow' });
    assert.deepEqual(StyleDecorator.applyRules('background: rgb(123, 456, 789); color: blue'), { background: 'rgb(123, 456, 789)', color: 'blue' });
    assert.deepEqual(StyleDecorator.applyRules('background: url("foo;bar"); color: blue'), { background: 'url("foo;bar")', color: 'blue' });
    assert.deepEqual(StyleDecorator.applyRules('background: url(\'foo;bar\'); color: blue'), { background: "url('foo;bar')", color: 'blue' });
});

