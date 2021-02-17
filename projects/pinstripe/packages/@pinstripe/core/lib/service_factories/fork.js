

import { serviceFactory } from '../service_factory.js';
import { Environment} from '../environment.js';

serviceFactory('fork', (parentEnvironment) => {
    return async (fn) => {
        const environment = Environment.new(parentEnvironment);
        const out = await fn(environment);
        await environment.cleanUp();
        return out;
    };
});
