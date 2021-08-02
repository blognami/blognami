
import { defineController } from 'pinstripe';

defineController('edit_post', ({ renderForm, posts, params: { id } }) => renderForm(posts.idEq(id).first(), {
    fields: ['title', 'body']
}));
