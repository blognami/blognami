
import { defineModel } from 'pinstripe';

defineModel('user', {
    meta(){
        this.hasMany('posts');
    }
});
