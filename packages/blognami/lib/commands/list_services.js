
import { ServiceFactory } from 'blognami';

export default {
    meta(){
        this.include(ServiceFactory.createListCommand({ noun: 'services' }));
    }
};
