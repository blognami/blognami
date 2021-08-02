
import { defineService } from 'pinstripe';

import { Environment } from '../environment.js';

defineService('forkEnvironment', parentEnvironment => {
    const { environment, resetEnvironment } = Environment.new(parentEnvironment);
    return async fn => {
        try {
            const out = await fn(environment);
            await resetEnvironment();
            return out;
        } catch(e){
            await resetEnvironment();
            throw e;
        }
    };
});
