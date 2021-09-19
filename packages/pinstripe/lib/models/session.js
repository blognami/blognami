
import { defineModel } from 'pinstripe';

defineModel('session', {
    meta(){
        this.belongsTo('user')

        this.mustNotBeBlank('passString')
        this.mustNotBeBlank('userId')
    }
});
