
import { MissingResourceError } from '../missing_resource_error.js';

export const client = {
    create(){
        return this;
    },

    start(){
        addEventListener("install", (event) => {
            event.waitUntil(skipWaiting());
        });
    
        addEventListener("fetch", (event) => {
            event.respondWith((async () => {
                const request1 = event.request.clone();
                const request2 = event.request.clone();
                
                try {
                    const params = await this.extractParams(request1);
                    console.log('------- params', params);

                    return fetch(request2);
                } catch (error) {
                    console.error('------- error', error);
                    if(!(error instanceof MissingResourceError)) throw error;
                    return fetch(request2);
                }
            })());
        });
    },

    async extractParams(request){
        const { method, url, headers } = request;
        const _url = new URL(url, 'http://127.0.0.1');

        const urlParams = {};
        _url.searchParams.forEach((value, key) => {
            urlParams[key] = value;
        });

        const body = method.match(/^POST|PUT|PATCH$/) ? await this.parseBody(request) : {};
        
        return {
            ...urlParams,
            ...body,
            _method: method,
            _url,
            _headers: this.normalizeHeaders(headers)
        };
    },

    normalizeHeaders(headers){
        const out = {};
        for(let [key, value] of headers){
            out[key] = value;
        }
        return out;
    },

    async parseBody(request){
        const body = await request.text();
        const contentType = request.headers.get('content-type');
        if(contentType == 'application/json'){
            return JSON.parse(body);
        }
        return {};
    }
};

export default client;
