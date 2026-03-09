
import { beforeEach, test } from 'node:test';
import assert from 'node:assert';

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

if(process.env.JOB_PROCESSING === 'distributed'){
    test(`leadJobCoordinator`, () => Workspace.run(async _ => {
        const { leadJobCoordinator, leadJobCoordinators } = _.database;

        assert.notEqual(await leadJobCoordinator, undefined);

        assert.equal(await leadJobCoordinators.count(), 1);
    }));
}
