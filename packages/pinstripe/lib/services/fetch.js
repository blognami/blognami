
import { defineService } from 'pinstripe';

defineService('fetch', ({ createEnvironment }) => {
    return (_params = {}) => createEnvironment(async ({ environment, renderController }) => {
        const params = normalizeParams(_params);
        const controllerName = params._path.replace(/^\/|\/$/g, '');

        environment.params = params;
        
        let out = await renderGuardControllers(renderController, controllerName, params);
        if(out){
            return out;
        }

        if(!controllerName.match(/(^|\/)_/)){
            out = normalizeResponse(await renderController(controllerName != '' ? `${controllerName}/index`: 'index', params));
            if(out){
                return out;
            }
            out = normalizeResponse(await renderController(controllerName, params));
            if(out){
                return out;
            }
        }
        
        out = await renderDefaultControllers(renderController, controllerName, params);
        if(out){
            return out;
        }

        return [404, {'Content-Type': 'text/plain'}, ['Not found']];
    });
});

const renderGuardControllers = async (renderController, controllerName, params) => {
    const controllerNameSegments = controllerName != '' ? controllerName.split(/\//) : [];
    const prefixSegments = [];
    while(true){
        const out = normalizeResponse(await renderController(prefixSegments.length ? [...prefixSegments, 'guard'].join('/') : 'guard', params));
        if(out){
            return out;
        }
        if(controllerNameSegments.length == 0){
            break;
        }
        prefixSegments.push(controllerNameSegments.shift());
    }
}

const renderDefaultControllers = async (renderController, controllerName,  params) => {
    const prefixSegments = controllerName != '' ? controllerName.split(/\//) : [];
    while(true){
        const out = normalizeResponse(await renderController(prefixSegments.length ? [...prefixSegments, 'default'].join('/') : 'default', {
            ...params,
            _pathOffset: params._path.substr(`/${prefixSegments.join('/')}`.length).replace(/^\//, '')
        }));
        if(out){
            return out;
        }
        if(prefixSegments.length == 0){
            break;
        }
        prefixSegments.pop();
    }
};   

const normalizeParams = (params) => {
    const out = { ...params }
    if(!out._method){
        out._method = 'get';
    }
    if(!params._path){
        out._path = '/';
    }
    if(!params._headers){
        out._headers = {};
    }
    return out;
};

const normalizeResponse = (response) => {
    if(response && typeof response.toResponseArray == 'function'){
        return response.toResponseArray();
    } else if(response && !Array.isArray(response)){
        return [200, {'Content-Type': 'text/plain'}, [`${response}`]];
    }
    return response;
};
