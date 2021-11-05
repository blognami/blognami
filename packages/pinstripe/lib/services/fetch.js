
export default ({ createEnvironment }) => {
    return (_params = {}) => createEnvironment(async ({ environment, renderView }) => {
        const params = normalizeParams(_params);
        const viewName = params._path.replace(/^\/|\/$/g, '');

        environment.params = params;
        
        let out = await renderGuardViews(renderView, viewName, params);
        if(out){
            return out;
        }

        if(!viewName.match(/(^|\/)_/)){
            out = normalizeResponse(await renderView(viewName != '' ? `${viewName}/index`: 'index', params));
            if(out){
                return out;
            }
            out = normalizeResponse(await renderView(viewName, params));
            if(out){
                return out;
            }
        }
        
        out = await renderDefaultViews(renderView, viewName, params);
        if(out){
            return out;
        }

        return [404, {'Content-Type': 'text/plain'}, ['Not found']];
    });
};

const renderGuardViews = async (renderView, viewName, params) => {
    const viewNameSegments = viewName != '' ? viewName.split(/\//) : [];
    const prefixSegments = [];
    while(true){
        const out = normalizeResponse(await renderView(prefixSegments.length ? [...prefixSegments, 'guard'].join('/') : 'guard', params));
        if(out){
            return out;
        }
        if(viewNameSegments.length == 0){
            break;
        }
        prefixSegments.push(viewNameSegments.shift());
    }
}

const renderDefaultViews = async (renderView, viewName,  params) => {
    const prefixSegments = viewName != '' ? viewName.split(/\//) : [];
    while(true){
        const out = normalizeResponse(await renderView(prefixSegments.length ? [...prefixSegments, 'default'].join('/') : 'default', {
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
