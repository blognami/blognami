
import { defineController } from 'pinstripe';

defineController('admin/edit_post_body', async ({ posts, params, renderView }) => {
    const post = posts.idEq(params.id).first();

    if(params._method == 'POST'){
        await post.update({
            body: params.body
        })
    }
    
    return renderView('admin/edit_post_body', {
        id: params.id,
        body: await post.body
    });
});
