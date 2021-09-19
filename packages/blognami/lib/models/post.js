
import { defineModel } from 'pinstripe';

import { Pageable } from './pageable.js';

defineModel('post', {
    meta(){
        this.include(Pageable);

        this.belongsTo('user');

        this.mustNotBeBlank('userId');
        this.mustNotBeBlank('title');
    }
});
