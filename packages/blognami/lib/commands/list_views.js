
import { View } from 'blognami';

export default {
    meta(){
        this.include(View.createListCommand({ noun: 'views' }));
    }
};
