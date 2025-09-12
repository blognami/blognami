


import { beforeEach, test } from 'node:test';
import assert from 'node:assert';

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`newsletter`, () => Workspace.run(async _ => {
    const { enableFree, enableMonthly, enableYearly } = await _.database.newsletter;

    assert.equal(enableFree, true);
    assert.equal(enableMonthly, false);
    assert.equal(enableYearly, false);
}));
