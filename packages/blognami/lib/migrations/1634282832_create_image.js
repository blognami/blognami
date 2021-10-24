
import { defineMigration } from 'pinstripe';

defineMigration('1634282832_create_image', async ({ database }) => {
    
    await database.images.addColumn('title', 'string');
    await database.images.addColumn('slug', 'string', { index: true });
    await database.images.addColumn('type', 'string');
    await database.images.addColumn('data', 'binary');
    
});
