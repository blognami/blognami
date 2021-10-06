
import { defineController } from 'pinstripe';

defineController('admin/edit_post_meta', ({ renderForm, posts, params: { id } }) => renderForm(posts.idEq(id).first(), {
    fields: ['title']
}));
