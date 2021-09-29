
import { defineController } from 'pinstripe';

defineController('delete_post', async ({ params, renderScript, posts }) => {
    const { id } = params;

    await posts.idEq(id).delete();
    
    return renderScript(() => this.frame.frame.load());
});
