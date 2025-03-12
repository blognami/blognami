
import test from 'node:test';
import assert from 'node:assert';

import { Workspace } from 'blognami';

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
    test(`cliUtils.normalizeFields (${i}})`, () => Workspace.run(function(){
        assert.deepEqual(this.cliUtils.normalizeFields(input), expectedOutput);
    }));
});


