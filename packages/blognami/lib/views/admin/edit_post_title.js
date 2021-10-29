
import { defineView } from 'pinstripe';

defineView('admin/edit_post_meta', ({ renderForm, posts, params: { id } }) => renderForm(posts.idEq(id).first(), {
    fields: ['title']
}));
