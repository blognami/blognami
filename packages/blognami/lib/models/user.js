
import { defineModel } from 'pinstripe';

defineModel('user', ({ hasMany }) => {
    hasMany('posts');
});
