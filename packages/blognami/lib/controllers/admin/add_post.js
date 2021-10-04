
import { defineController } from 'pinstripe';

defineController('admin/add_post', ({ renderForm, posts }) => renderForm(posts, {
    fields: ['userId', 'title']
}));
