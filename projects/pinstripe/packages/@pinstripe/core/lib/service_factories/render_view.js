
import { serviceFactory } from '../service_factory.js';
import { View } from '../view.js';

serviceFactory('renderView', ({ fork }) => {
    return (viewName, params = {}) => fork(async ({ environment, inject }) => {
        const view = View.create(viewName, environment);
        inject('view', view);
        inject('params', params);
        return view.render();
    });
});
