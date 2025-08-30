import test from 'node:test';
import assert from 'node:assert';

import { StyleDecorator } from './style_decorator.js';

test(`StyleDecorator.parseRules`, () => {
    assert.deepEqual(StyleDecorator.parseDecorators(''), []);
    assert.deepEqual(StyleDecorator.parseDecorators(' '), []);
    assert.deepEqual(StyleDecorator.parseDecorators('  '), []);

    // Single rules
    assert.deepEqual(StyleDecorator.parseDecorators('background: yellow'), ['background: yellow']);
    assert.deepEqual(StyleDecorator.parseDecorators('background: yellow;'), ['background: yellow']);
    assert.deepEqual(StyleDecorator.parseDecorators('background: yellow '), ['background: yellow']);
    assert.deepEqual(StyleDecorator.parseDecorators('background: yellow; '), ['background: yellow']);
    assert.deepEqual(StyleDecorator.parseDecorators(' background: yellow; '), ['background: yellow']);
    assert.deepEqual(StyleDecorator.parseDecorators(' background: yellow ; '), ['background: yellow']);

    // Multiple rules
    assert.deepEqual(StyleDecorator.parseDecorators('background: yellow; color: blue'), ['background: yellow', 'color: blue']);
    assert.deepEqual(StyleDecorator.parseDecorators('background: yellow ; color: blue'), ['background: yellow', 'color: blue']);
    assert.deepEqual(StyleDecorator.parseDecorators(' background: yellow  ;  color: blue '), ['background: yellow', 'color: blue']);
    assert.deepEqual(StyleDecorator.parseDecorators('background: rgb(123, 456, 789); color: blue'), ['background: rgb(123, 456, 789)', 'color: blue']);
    assert.deepEqual(StyleDecorator.parseDecorators('background: url("foo;bar"); color: blue'), ['background: url("foo;bar")', 'color: blue']);
    assert.deepEqual(StyleDecorator.parseDecorators('background: url(\'foo;bar\'); color: blue'), ['background: url(\'foo;bar\')', 'color: blue']);

    // Other
    assert.deepEqual(StyleDecorator.parseDecorators('background: url("foo;bar"); P; color: blue;'), ['background: url("foo;bar")', 'P', 'color: blue']);
});

test(`StyleDecorator.normalizeRules`, () => {
    assert.deepEqual(StyleDecorator.normalizeDecorators([]), []);
    assert.deepEqual(StyleDecorator.normalizeDecorators(['background: yellow']), [{name: 'background', value: 'yellow'}]);
    assert.deepEqual(StyleDecorator.normalizeDecorators(['background: rgb(123, 456, 789)']), [{name: 'background', value: 'rgb(123, 456, 789)'}]);
    assert.deepEqual(StyleDecorator.normalizeDecorators(['background: url("foo;bar")']), [{name: 'background', value: 'url("foo;bar")'}]);
    assert.deepEqual(StyleDecorator.normalizeDecorators(['P']), [{name: 'P', value: ''}]);
    assert.deepEqual(StyleDecorator.normalizeDecorators(['color: blue']), [{name: 'color', value: 'blue'}]);
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
    StyleDecorator.compileDecorators('background: yellow').call(stub, 'STUB_STYLES');
    assert.deepEqual(stub.calls, [
        ['create', 'background', 'STUB_STYLES', 'yellow'],
        ['apply']
    ]);
    
    stub = createStub();
    StyleDecorator.compileDecorators('background: rgb(123, 456, 789); P; color: blue').call(stub, 'STUB_STYLES');
    assert.deepEqual(stub.calls, [
        ['create', 'background', 'STUB_STYLES', 'rgb(123, 456, 789)'], ['apply'],
        ['create', 'P', 'STUB_STYLES', ''], ['apply'],
        ['create', 'color', 'STUB_STYLES', 'blue'], ['apply']
    ]);
});

test(`StyleDecorator.applyDecorators`, () => {
    assert.deepEqual(StyleDecorator.applyDecorators('background: yellow').properties, { background: 'yellow' });
    assert.deepEqual(StyleDecorator.applyDecorators('background: rgb(123, 456, 789); color: blue').properties, { background: 'rgb(123, 456, 789)', color: 'blue' });
    assert.deepEqual(StyleDecorator.applyDecorators('background: url("foo;bar"); color: blue').properties, { background: 'url("foo;bar")', color: 'blue' });
    assert.deepEqual(StyleDecorator.applyDecorators('background: url(\'foo;bar\'); color: blue').properties, { background: "url('foo;bar')", color: 'blue' });
});
