import test from 'node:test';
import assert from 'node:assert';

import { StyleRule } from './style_rule.js';

test(`StyleRule.parseRules`, () => {
    assert.deepEqual(StyleRule.parseRules(''), []);
    assert.deepEqual(StyleRule.parseRules(' '), []);
    assert.deepEqual(StyleRule.parseRules('  '), []);
    assert.deepEqual(StyleRule.parseRules('apple'), ['apple']);
    assert.deepEqual(StyleRule.parseRules('apple banana'), ['apple', 'banana']);
    assert.deepEqual(StyleRule.parseRules(' apple   banana '), ['apple', 'banana']);

    assert.deepEqual(StyleRule.parseRules('apple()'), ['apple()']);
    assert.deepEqual(StyleRule.parseRules('apple(1, 2) banana(3, 4)'), ['apple(1, 2)', 'banana(3, 4)']);
    assert.deepEqual(StyleRule.parseRules(' apple(1, 2)   banana(3, 4) '), ['apple(1, 2)', 'banana(3, 4)']);

    assert.deepEqual(StyleRule.parseRules('apple(1, pear(2, "plum", { peach: 5 })) banana(3, 4)'), ['apple(1, pear(2, "plum", { peach: 5 }))', 'banana(3, 4)']);

    assert.deepEqual(StyleRule.parseRules('apple-fruit pear-#fruit banana-(!@£$%^&*()) mango-1 plum'), ['apple-fruit', 'pear-#fruit', 'banana-(!@£$%^&*())', 'mango-1', 'plum']);
});

test(`StyleRule.normalizeRules`, () => {
    assert.deepEqual(StyleRule.normalizeRules([]), []);
    assert.deepEqual(StyleRule.normalizeRules(['apple']), [{name: 'apple', args: ''}]);
    assert.deepEqual(StyleRule.normalizeRules(['apple-1']), [{name: 'apple', args: '"1"'}]);
    assert.deepEqual(StyleRule.normalizeRules(['apple-1-pear']), [{name: 'apple', args: '"1-pear"'}]);
    assert.deepEqual(StyleRule.normalizeRules(['apple-pear-1-pear-plum']), [{name: 'apple-pear', args: '"1-pear-plum"'}]);
    assert.deepEqual(StyleRule.normalizeRules(['apple-pear-$-pear-plum']), [{name: 'apple-pear', args: '"$-pear-plum"'}]);
    assert.deepEqual(StyleRule.normalizeRules(['apple(1, 2)']), [ {name: 'apple', args: '1, 2'}]);
    assert.deepEqual(StyleRule.normalizeRules(['apple-fruit']), [ {name: 'apple-fruit', args: ''}]);
    assert.deepEqual(StyleRule.normalizeRules(['pear-#fruit']), [ {name: 'pear', args:  '"#fruit"'}]);
    assert.deepEqual(StyleRule.normalizeRules(['banana-(!@£$%^&*())']), [ {name: 'banana', args:  '"!@£$%^&*()"' }]);
    assert.deepEqual(StyleRule.normalizeRules(['plum']), [ {name: 'plum', args: ''}]);
    assert.deepEqual(StyleRule.normalizeRules(['peach(pineapple-fruit)']), [ {name: 'peach', args: 'pineapple-fruit'}]);
});

test(`StyleRule.compileRules`, () => {
    const createStub = () => ({
        calls: [],

        create(...args){
            this.calls.push(['create', ...args]);
            return this;
        },

        apply(){
            this.calls.push(['apply']);
        }
    });
    
    let stub = createStub();
    StyleRule.compileRules('apple').call(stub, 'STUB_STYLES');

    assert.deepEqual(stub.calls, [
        ['create', 'apple', 'STUB_STYLES'],
        ['apply']
    ]);

    stub = createStub();
    StyleRule.compileRules('pear-1 banana-#fruit peach("plum") plum-fruit(1, "apple", { peach: "pineapple"})').call(stub, 'STUB_STYLES');

    assert.deepEqual(stub.calls, [
        ['create', 'pear', 'STUB_STYLES', '1'], ['apply'],
        ['create', 'banana', 'STUB_STYLES', '#fruit'], ['apply'],
        ['create', 'peach', 'STUB_STYLES', 'plum'], ['apply'],
        ['create', 'plum-fruit', 'STUB_STYLES', '1', 'apple', {peach: 'pineapple'}], ['apply']
    ]);
});
