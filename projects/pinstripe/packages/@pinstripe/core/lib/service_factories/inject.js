
import { serviceFactory } from '../service_factory.js';

serviceFactory('inject', (environment) => {
    return (name, value) => {
        environment[name] = value;
    };
});
