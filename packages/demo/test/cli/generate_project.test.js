

import { afterEach, test } from 'node:test';
import assert from 'node:assert';

import { reset, inPackagesDir, run } from './helpers.js';

afterEach(reset);

test(`sintra generate-project`, () => inPackagesDir(() => {
    assert.equal(run(`npx sintra generate-project`).stderr, 'A project --name must be given.');
}));

test(`sintra generate-project --name generate-project-test`, () => inPackagesDir(() => {
    run(`npx sintra generate-project --name generate-project-test`);
    assert.ok(run(`ls`).stdout.includes(`generate-project-test`), `Project directory not created`);
}));
