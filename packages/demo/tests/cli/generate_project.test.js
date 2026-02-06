

import { afterEach, test, describe } from 'node:test';
import assert from 'node:assert';

import { reset, inPackagesDir, run } from './helpers.js';

afterEach(reset);

test(`pinstripe generate-project`, () => inPackagesDir(() => {
    assert.equal(run(`npx pinstripe generate-project`).stderr, [
        'There was an error validating the command parameters:',
        '',
        '  * name: Must not be blank'
    ].join('\n'));
}));

test(`pinstripe generate-project --name generate-project-test`, () => inPackagesDir(() => {
    run(`npx pinstripe generate-project --name generate-project-test`);
    assert.ok(run(`ls`).stdout.includes(`generate-project-test`), `Project directory not created`);
}));
