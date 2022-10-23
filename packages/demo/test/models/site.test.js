

import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`site`, () => Workspace.run(async _ => {
    const { site, sites } = _.database;

    const { title } = await site;

    expect(title).toBe('');

    expect(await sites.count()).toBe(1);
}));
