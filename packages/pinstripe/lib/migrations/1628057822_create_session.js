
import { defineMigration } from 'pinstripe';

defineMigration('1628057822_create_session', async ({ sessions }) => {
    
    await sessions.addColumn('passString', 'string');
    await sessions.addColumn('userId', 'foreign_key');
    
});
