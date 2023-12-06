
import { Workspace } from "../workspace.js";

export default {
    create(){
        return (params, useContext = false) => {
            if(useContext) return this.handleCall(params);
            return Workspace.run(function(){
                return this.fetch(params, true);
            });
        };
    },
    
    async handleCall(params = {}){
        const normalizedParams = this.normalizeParams(params);
        this.context.params = normalizedParams;

        const viewName = normalizedParams._url.pathname.replace(/^\/|\/$/g, '');
        
        let out = await this.renderGuardViews(viewName, normalizedParams);
        if(out){
            return out;
        }

        if(!viewName.match(/(^|\/)_[^\/]+(|\/index)$/)){
            out = this.normalizeResponse(await this.app.renderView(viewName != '' ? `${viewName}/index`: 'index', normalizedParams));
            if(out){
                return out;
            }
        
            out = this.normalizeResponse(await this.app.renderView(viewName, normalizedParams));
            if(out){
                return out;
            }
        }
        
        out = await this.renderDefaultViews(viewName, normalizedParams);
        if(out){
            return out;
        }

        return [404, {'content-type': 'text/plain'}, ['Not found']];
    },

    async renderGuardViews(viewName, params){
        const viewNameSegments = viewName != '' ? viewName.split(/\//) : [];

        const candidateIndexView = [...viewNameSegments, 'index'].join('/');
        const candidateDefaultView = [...viewNameSegments, 'default'].join('/');

        if(!this.app.isView(candidateIndexView) && !this.app.isView(candidateDefaultView)){
            viewNameSegments.pop();
        }

        const prefixSegments = [];
        while(true){
            const out = this.normalizeResponse(await this.app.renderView(prefixSegments.length ? [...prefixSegments, 'guard'].join('/') : 'guard', params));
            if(out){
                return out;
            }
            if(viewNameSegments.length == 0){
                break;
            }
            prefixSegments.push(viewNameSegments.shift());
        }
    },

    async renderDefaultViews(viewName, params){
        const prefixSegments = viewName != '' ? viewName.split(/\//) : [];
        while(true){
            const out = this.normalizeResponse(await this.app.renderView(prefixSegments.length ? [...prefixSegments, 'default'].join('/') : 'default', params));
            if(out){
                return out;
            }
            if(prefixSegments.length == 0){
                break;
            }
            prefixSegments.pop();
        }
    },

    normalizeParams(params){
        const out = { ...params }
        if(!out._method){
            out._method = 'get';
        }
        if(!params._url){
            out._url = new URL('http://localhost')
        }
        if(!params._headers){
            out._headers = {};
        }
        return out;
    },

    normalizeResponse(response){
        if(!response) return;

        let responseArray;
        if(response && typeof response.toResponseArray == 'function'){
            responseArray = response.toResponseArray();
        } else if(response && !Array.isArray(response)){
            responseArray = [200, {'content-type': 'text/plain'}, [`${response}`]];
        } else {
            responseArray = response;
        }

        const [ status, headers, body ] = responseArray;
        const normalizedHeaders = {};
        Object.keys(headers).forEach(name => {
            normalizedHeaders[name.toLowerCase()] = headers[name];
        })

        return [ status, normalizedHeaders, body ];
    }
};
