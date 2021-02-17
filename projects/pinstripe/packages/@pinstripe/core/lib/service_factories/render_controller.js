
import { serviceFactory } from '../service_factory.js';
import { Controller } from '../controller.js';

serviceFactory('renderController', ({ fork }) => {
    return (controllerName, params = {}) => fork(async ({ environment, inject }) => {
        const controller = Controller.create(controllerName, environment);
        inject('controller', controller);
        inject('params', params);
        return controller.render();
     });
});
