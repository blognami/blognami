
import { defineView } from 'pinstripe';

defineView('admin/add_post', ({ renderForm, posts }) => renderForm(posts, {
    fields: ['userId', 'title']
}));
