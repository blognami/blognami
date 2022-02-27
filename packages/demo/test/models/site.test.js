

import 'demo';
import { createEnvironment } from 'pinstripe';

let environment;

beforeEach(async () => {
    environment = await createEnvironment();
    await environment.runCommand('reset-database');
});

test(`site`, async () => {
    const { site, sites } = environment;

    const { title, sidebar } = await site;

    expect(title).toBe('');
    expect(sidebar).toBe(null);

    expect(await sites.count()).toBe(1);
});

afterEach(() => environment.resetEnvironment());