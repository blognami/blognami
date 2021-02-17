
import { serviceFactory } from '../service_factory.js';

serviceFactory('controller', ({ parentEnvironment }) => {
    return parentEnvironment ? parentEnvironment.controller : null;
});
