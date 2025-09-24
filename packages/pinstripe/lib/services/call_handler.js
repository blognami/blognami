
import { Workspace } from "../workspace.js";

export default {
    meta(){
        this.addToClient();
    },

    create(){
        return this;
    },
    
    async handleCall(params = {}, useContext = false){
        if(!useContext) return Workspace.run(function(){
            return this.callHandler.handleCall(params, true);
        });

        this.context.params = this.normalizeParams(params);
        
        const out = this.normalizeResponse(await this.render());
        if(out) return out;

        return [404, {'content-type': 'text/plain'}, ['Not found']];
    },

    async render(){
        const viewName = this.params._url.pathname.replace(/^\/|\/$/g, '') || 'index';
        
        let out = await this.renderGuardViews(viewName, this.params);
        if(out) return out;

        if(!viewName.match(/(^|\/)_[^\/]+(|\/index)$/)){
            out = await this.renderView(viewName, this.params);
            if(out) return out;
        }
        
        return this.renderDefaultViews(viewName, this.params);
    },

    async renderGuardViews(viewName, params){
        const viewNameSegments = viewName != '' ? viewName.split(/\//) : [];

        const prefixSegments = [];
        while(true){
            const candidateGuardViewName = prefixSegments.length ? [...prefixSegments, 'guard'].join('/') : 'guard';
            const out = await this.renderView(candidateGuardViewName, params);
            if(out) return out;
            if(viewNameSegments.length == 0) break;
            prefixSegments.push(viewNameSegments.shift());
        }
    },

    async renderDefaultViews(viewName, params){
        const prefixSegments = viewName != '' ? viewName.split(/\//) : [];
        while(true){
            const candidateDefaultViewName = prefixSegments.length ? [...prefixSegments, 'default'].join('/') : 'default';
            const out = await this.renderView(candidateDefaultViewName, params);
            if(out) return out;
            if(prefixSegments.length == 0) break;
            prefixSegments.pop();
        }
    },

    normalizeParams(params){
        const out = { ...params }
        if(!out._method) out._method = 'get';
        out._url = new URL(out._url ?? '/', 'http://localhost');
        if(!params._headers) out._headers = {};
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
        });

        return [ status, normalizedHeaders, body ];
    }
};


