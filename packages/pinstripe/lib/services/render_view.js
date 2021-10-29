
import { defineService } from 'pinstripe';

import { View } from '../view.js';

defineService('renderView', ({ forkEnvironment, view }) => {
    return (viewName, params = {}) => forkEnvironment(({ environment }) => {
        const segments = view.constructor.name.split(/\//);
        while(segments.length){
            segments[segments.length -  1] = viewName;
            environment.params = { ...params };
            environment.view = View.create(segments.join('/'), environment);
            const out = environment.view.render();
            if(out){
                return out;
            }
            segments.pop();
        }
    });
});
