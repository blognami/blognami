
import { defineCommand } from 'pinstripe';

defineCommand('reset-database', async ({ rundefineCommand }) => {
    await rundefineCommand('drop-database');
    await rundefineCommand('init-database');
});
