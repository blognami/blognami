
import { defineMigration } from 'pinstripe';

defineMigration('1627976184_create_user', async ({ users }) => {
    
    await users.addColumn('name', 'string');
    await users.addColumn('email', 'string');
    await users.addColumn('encryptedPassword', 'string');
    
});
