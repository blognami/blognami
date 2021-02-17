
import { serviceFactory } from '../service_factory.js';

serviceFactory('rootEnvironment', ({ parentEnvironment, environment }) => {
    return parentEnvironment ? parentEnvironment.rootEnvironment : environment;
});
