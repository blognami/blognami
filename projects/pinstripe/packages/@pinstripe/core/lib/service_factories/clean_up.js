
import { serviceFactory } from '../service_factory.js';

serviceFactory('cleanUp', (environment) => {
    return async () => {
        const names = Object.keys(environment);
        for(let i in names){
            const name = names[i];
            const object = environment[name];
            if(!object){
                continue;
            }
            if(object instanceof environment.constructor){
                continue;
            }
            if(typeof object.cleanUp != 'function'){
                continue;
            }
            if(isAttachedToAncestor(environment, name, object)){
                continue;
            }
            await object.cleanUp();
        }
    };
});

const isAttachedToAncestor = (environment, name, object) => {
    if(environment.parentEnvironment){
        if(environment.parentEnvironment[name] === object){
            return true;
        }
        return isAttachedToAncestor(environment.parentEnvironment, name, object)
    }
    return false;
}
