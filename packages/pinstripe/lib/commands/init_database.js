
import { defineCommand } from 'pinstripe';

defineCommand('init-database', async ({ rundefineCommand }) => {
    await rundefineCommand('create-database');
    await rundefineCommand('migrate-database');
    await rundefineCommand('seed-database');
});
