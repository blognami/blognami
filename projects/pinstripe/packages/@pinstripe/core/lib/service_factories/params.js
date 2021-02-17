
import { serviceFactory } from '../service_factory.js';

serviceFactory('params', ({ parentEnvironment }) => {
    return parentEnvironment ? { ...parentEnvironment.params } : {
        _method: 'GET',
        _path: '/',
        _headers: {}
    };
});
