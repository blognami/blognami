
import { defineService } from 'pinstripe';

import { View } from '../view.js';

defineService('renderView', ({ forkEnvironment }) => {
    return (viewName, params = {}) => forkEnvironment(({ environment }) => {
        environment.params = { ...params };

        const body = View.render(viewName, environment);

        if(!environment.params.layout){
            return body;
        }

        environment.params.body = body;
        
        const segments = viewName.split(/\//);
        while(segments.length){
            segments[segments.length -  1] = 'layout';
            const out = View.render(segments.join('/'), environment);
            if(out){
                return out;
            }
            segments.pop();
        }

    });
});
