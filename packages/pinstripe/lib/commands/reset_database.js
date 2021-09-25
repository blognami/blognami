
import { defineCommand } from 'pinstripe';

defineCommand('reset-database', async ({ runCommand }) => {
    await runCommand('drop-database');
    await runCommand('init-database');
});
