


import { Workspace, reset } from './helpers.js';

beforeEach(reset);

test(`session`, () => Workspace.run(async _ => {
    const { sessions, users } = _.database;

    expect(await sessions.count()).toBe(0);

    const user = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin'
    });

    const session = await sessions.insert({
        userId: user.id,
        passString: 'foo'
    });

    expect(await sessions.count()).toBe(1);

    expect(await session.user.name).toBe('Admin');
}));

