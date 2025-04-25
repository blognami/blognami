
import { Workspace } from "../workspace.js";

export default {
    create(){
        return this;
    },
    
    async handleCall(params = {}, useContext = false){
        if(!useContext) return Workspace.run(function(){
            return this.callHandler.handleCall(params, true);
        });

        this.context.params = this.normalizeParams(params);
        
        const out = this.normalizeResponse(await this.app.render());
        if(out) return out;

        return [404, {'content-type': 'text/plain'}, ['Not found']];
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


