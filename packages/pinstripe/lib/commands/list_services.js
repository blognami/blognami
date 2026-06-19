
import { ServiceFactory } from 'pinstripe';

export default {
    meta(){
        this.include(ServiceFactory.createListCommand({ noun: 'services' }));
        this.tag('core');
    }
};
