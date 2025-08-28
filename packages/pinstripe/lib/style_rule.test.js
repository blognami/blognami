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

// test(`StyleRule.parseRules`, () => {
//     assert.deepEqual(StyleRule.parseRules(''), []);
//     assert.deepEqual(StyleRule.parseRules(' '), []);
//     assert.deepEqual(StyleRule.parseRules('  '), []);
//     assert.deepEqual(StyleRule.parseRules('apple'), ['apple']);
//     assert.deepEqual(StyleRule.parseRules('apple banana'), ['apple', 'banana']);
//     assert.deepEqual(StyleRule.parseRules(' apple   banana '), ['apple', 'banana']);

//     assert.deepEqual(StyleRule.parseRules('apple()'), ['apple()']);
//     assert.deepEqual(StyleRule.parseRules('apple(1, 2) banana(3, 4)'), ['apple(1, 2)', 'banana(3, 4)']);
//     assert.deepEqual(StyleRule.parseRules(' apple(1, 2)   banana(3, 4) '), ['apple(1, 2)', 'banana(3, 4)']);

//     assert.deepEqual(StyleRule.parseRules('apple(1, pear(2, "plum", { peach: 5 })) banana(3, 4)'), ['apple(1, pear(2, "plum", { peach: 5 }))', 'banana(3, 4)']);

//     assert.deepEqual(StyleRule.parseRules('apple-fruit pear-#fruit banana-(!@£$%^&*()) mango-1 plum'), ['apple-fruit', 'pear-#fruit', 'banana-(!@£$%^&*())', 'mango-1', 'plum']);
// });

// test(`StyleRule.normalizeRules`, () => {
//     assert.deepEqual(StyleRule.normalizeRules([]), []);
//     assert.deepEqual(StyleRule.normalizeRules(['apple']), [{name: 'apple', value: ''}]);
//     assert.deepEqual(StyleRule.normalizeRules(['apple-1']), [{name: 'apple', value: '"1"'}]);
//     assert.deepEqual(StyleRule.normalizeRules(['apple-1-pear']), [{name: 'apple', value: '"1-pear"'}]);
//     assert.deepEqual(StyleRule.normalizeRules(['apple-pear-1-pear-plum']), [{name: 'apple-pear', value: '"1-pear-plum"'}]);
//     assert.deepEqual(StyleRule.normalizeRules(['apple-pear-$-pear-plum']), [{name: 'apple-pear', value: '"$-pear-plum"'}]);
//     assert.deepEqual(StyleRule.normalizeRules(['apple(1, 2)']), [ {name: 'apple', value: '1, 2'}]);
//     assert.deepEqual(StyleRule.normalizeRules(['apple-fruit']), [ {name: 'apple-fruit', value: ''}]);
//     assert.deepEqual(StyleRule.normalizeRules(['pear-#fruit']), [ {name: 'pear', value:  '"#fruit"'}]);
//     assert.deepEqual(StyleRule.normalizeRules(['banana-(!@£$%^&*())']), [ {name: 'banana', value:  '"!@£$%^&*()"' }]);
//     assert.deepEqual(StyleRule.normalizeRules(['plum']), [ {name: 'plum', value: ''}]);
//     assert.deepEqual(StyleRule.normalizeRules(['peach(pineapple-fruit)']), [ {name: 'peach', value: 'pineapple-fruit'}]);
// });

// test(`StyleRule.compileRules`, () => {
//     const createStub = () => ({
//         calls: [],

//         create(...value){
//             this.calls.push(['create', ...value]);
//             return this;
//         },

//         apply(){
//             this.calls.push(['apply']);
//         }
//     });
    
//     let stub = createStub();
//     StyleRule.compileRules('apple').call(stub, 'STUB_STYLES');

//     assert.deepEqual(stub.calls, [
//         ['create', 'apple', 'STUB_STYLES'],
//         ['apply']
//     ]);

//     stub = createStub();
//     StyleRule.compileRules('pear-1 banana-#fruit peach("plum") plum-fruit(1, "apple", { peach: "pineapple"})').call(stub, 'STUB_STYLES');

//     assert.deepEqual(stub.calls, [
//         ['create', 'pear', 'STUB_STYLES', '1'], ['apply'],
//         ['create', 'banana', 'STUB_STYLES', '#fruit'], ['apply'],
//         ['create', 'peach', 'STUB_STYLES', 'plum'], ['apply'],
//         ['create', 'plum-fruit', 'STUB_STYLES', '1', 'apple', {peach: 'pineapple'}], ['apply']
//     ]);
// });
