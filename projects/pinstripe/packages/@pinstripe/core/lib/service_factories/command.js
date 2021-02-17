
import { serviceFactory } from '../service_factory.js';

serviceFactory('command', ({ parentEnvironment }) => {
    return parentEnvironment ? parentEnvironment.command : null;
});
