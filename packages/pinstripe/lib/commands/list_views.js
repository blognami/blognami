
import { View } from 'pinstripe';

export default {
    meta(){
        this.include(View.createListCommand({ noun: 'views' }));
        this.tag('view');
    }
};
