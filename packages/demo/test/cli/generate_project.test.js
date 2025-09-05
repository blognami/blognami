

import { afterEach, test } from 'node:test';
import assert from 'node:assert';

import { reset, inPackagesDir, run } from './helpers.js';

afterEach(reset);

test(`pinstripe generate-project`, () => inPackagesDir(() => {
    assert.equal(run(`npx pinstripe generate-project`).stderr, 'A project --name must be given.');
}));

test(`pinstripe generate-project --name generate-project-test`, () => inPackagesDir(() => {
    run(`npx pinstripe generate-project --name generate-project-test`);
    assert.ok(run(`ls`).stdout.includes(`generate-project-test`), `Project directory not created`);
}));
