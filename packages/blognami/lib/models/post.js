
import { defineModel } from 'pinstripe';

import { Pageable } from './pageable.js';

defineModel('post', ({ include, belongsTo, mustNotBeBlank }) => {
    include(Pageable);

    belongsTo('user');

    mustNotBeBlank('userId');
    mustNotBeBlank('title');
});
