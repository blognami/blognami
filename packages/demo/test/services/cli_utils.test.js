
import { Workspace } from 'pinstripe';

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
        expect(this.cliUtils.normalizeFields(input)).toStrictEqual(expectedOutput);
    }));
});


