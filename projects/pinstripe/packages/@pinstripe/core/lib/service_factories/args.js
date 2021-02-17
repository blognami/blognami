
import { serviceFactory } from '../service_factory.js';

serviceFactory('args', ({ parentEnvironment }) => {
    return parentEnvironment ? [ ...parentEnvironment.args ] : [];
});
