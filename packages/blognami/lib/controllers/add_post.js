
import { defineController } from 'pinstripe';

defineController('add_post', ({ renderForm, posts }) => renderForm(posts, {
    fields: ['userId', 'title']
}));
