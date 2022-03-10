

import 'demo';
import { createEnvironment } from 'pinstripe';

let environment;

beforeEach(async () => {
    environment = await createEnvironment();
    await environment.runCommand('reset-database');
});

test(`site`, async () => {
    const { site, sites } = environment;

    const { title } = await site;

    expect(title).toBe('');

    expect(await sites.count()).toBe(1);
});

afterEach(() => environment.resetEnvironment());