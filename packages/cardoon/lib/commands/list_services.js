
import { ServiceFactory } from 'cardoon';

export default {
    meta(){
        this.include(ServiceFactory.createListCommand({ noun: 'services' }));
        this.tag('core');
    }
};
