
import { defineModel } from 'pinstripe';

defineModel('post', {
    meta(){
        this.include('pageable');
        
        this.belongsTo('user');

        this.mustNotBeBlank('userId');
        this.mustNotBeBlank('title');
    }
});
