
import { defineModel } from 'pinstripe';

defineModel('session', ({ belongsTo, mustNotBeBlank }) => {
    belongsTo('user')

    mustNotBeBlank('passString')
    mustNotBeBlank('userId')

});
