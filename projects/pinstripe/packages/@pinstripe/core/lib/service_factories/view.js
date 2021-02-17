
import { serviceFactory } from '../service_factory.js';

serviceFactory('view', ({ parentEnvironment }) => {
    return parentEnvironment ? parentEnvironment.view : null;
});
