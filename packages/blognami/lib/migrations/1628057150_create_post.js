
import { defineMigration } from 'pinstripe';

defineMigration('1628057150_create_post', async ({ posts }) => {
    
    await posts.addColumn('userId', 'foreign_key');
    await posts.addColumn('title', 'string');
    await posts.addColumn('slug', 'string', { index: true });
    await posts.addColumn('body', 'text');
    
});
