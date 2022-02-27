


import 'demo';
import { createEnvironment } from 'pinstripe';

let environment;

beforeEach(async () => {
    environment = await createEnvironment();
    await environment.runCommand('reset-database');
});

test(`session`, async () => {
    const { sessions, users } = environment;

    expect(await sessions.count()).toBe(0);

    const user = await users.insert({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'secret',
        role: 'admin'
    });

    const session = await sessions.insert({
        userId: user.id,
        passString: 'foo'
    });

    expect(await sessions.count()).toBe(1);

    expect(await session.user.name).toBe('Admin');
});

afterEach(() => environment.resetEnvironment());
