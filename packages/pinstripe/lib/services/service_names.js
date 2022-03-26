
import { ServiceFactory } from '../service_factory.js';

export default () => {
    return Object.keys(ServiceFactory.classes).sort();
};
