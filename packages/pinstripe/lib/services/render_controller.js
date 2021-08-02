
import { defineService } from 'pinstripe';

import { Controller } from '../controller.js';

defineService('renderController', ({ forkEnvironment }) => {
    return (controllerName, params = {}) => forkEnvironment(({ environment }) => {
        environment.params = { ...params };
        return Controller.render(controllerName, environment);
    });
});
