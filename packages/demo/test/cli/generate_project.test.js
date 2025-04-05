

import { afterEach, test } from 'node:test';
import assert from 'node:assert';

import { reset, inPackagesDir, run } from './helpers.js';

afterEach(reset);

test(`blognami generate-project`, () => inPackagesDir(() => {
    assert.equal(run(`npx blognami generate-project`).stderr, 'A project --name must be given.');
}));

test(`blognami generate-project --name generate-project-test`, () => inPackagesDir(() => {
    run(`npx blognami generate-project --name generate-project-test`);
    assert.ok(run(`ls`).stdout.includes(`generate-project-test`), `Project directory not created`);
}));
