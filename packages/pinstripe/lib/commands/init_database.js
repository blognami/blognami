
import { defineCommand } from 'pinstripe';

defineCommand('init-database', async ({ runCommand }) => {
    await runCommand('create-database');
    await runCommand('migrate-database');
    await runCommand('seed-database');
});
