


import { beforeEach, test } from 'node:test';
import assert from 'node:assert';

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`newsletter`, () => Workspace.run(async _ => {
    const { newsletter } = _.database;
    const { enableFree, enableMonthly, enableYearly } = await newsletter;

    assert.equal(enableFree, true);
    assert.equal(enableMonthly, false);
    assert.equal(enableYearly, false);

    assert.equal(await newsletter.subscriptions.count(), 0);
}));
