
import { defineService } from 'pinstripe';

import { View } from '../view.js';

defineService('renderView', ({ forkEnvironment }) => {
    return (viewName, params = {}) => forkEnvironment(({ environment }) => {
        environment.params = { ...params };
        return View.render(viewName, environment);
    });
});
