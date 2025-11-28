
import test from 'node:test';
import assert from 'node:assert';

import { Command } from 'pinstripe';

Command.register('test-fields', {
    meta(){
        this.hasParam('fields', { type: 'fields', optional: true });
    }
});

[
    { input: '', expectedOutput: []},
    { input: 'apple', expectedOutput: [{ mandatory: false, name: 'apple', type: 'string' }] },
    { input: '^apple', expectedOutput: [{ mandatory: true, name: 'apple', type: 'string' }] },
    { input: 'apple:integer', expectedOutput: [{ mandatory: false, name: 'apple', type: 'integer' }] },
    { input: '^apple:integer', expectedOutput: [{ mandatory: true, name: 'apple', type: 'integer' }] },
    { input: 'apple ^pear:integer plum:fruit', expectedOutput: [
        { mandatory: false, name: 'apple', type: 'string' },
        { mandatory: true, name: 'pear', type: 'integer' },
        { mandatory: false, name: 'plum', type: 'fruit' }
    ] },
].forEach(({ input, expectedOutput}, i) => {
    test(`fields parameter type (${i})`, () => {
        const TestCommand = Command.for('test-fields');
        const extracted = TestCommand.extractParams(['--fields', input]);
        const coerced = TestCommand.coerceParams(extracted);
        assert.deepEqual(coerced.fields, expectedOutput);
    });
});

