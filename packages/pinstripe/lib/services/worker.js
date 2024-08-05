
import { MissingResourceError } from '../missing_resource_error.js';

export const client = true;

export default {
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
                    const [ status, headers, body ] = await this.callHandler.handleCall(params);
                    console.log('------- [ status, headers, body ]', [ status, headers, body ]);

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
        return {
            ...(await this.extractUrlParams(request)),
            ...(await this.extractBodyParams(request)),
            _method: request.method,
            _url: this.extractUrl(request),
            _headers: this.extractHeaders(request)
        };
    },

    extractUrl(request){
        return new URL(request.url, 'http://127.0.0.1');
    },

    extractUrlParams(request){
        const out = {};
        this.extractUrl(request).searchParams.forEach((value, key) => {
            out[key] = value;
        });
        return out;
    },

    extractHeaders(request){
        const out = {};
        for(let [key, value] of request.headers){
            out[key] = value;
        }
        return out;
    },

    async extractBodyParams(request){
        if(!request.method.match(/^POST|PUT|PATCH$/)) return {};
        const contentType = request.headers.get('content-type') ?? '';
        if(contentType == 'application/json') return request.json();
        const out = {};
        if(contentType.match(/^multipart\/form-data/)){
            const formData = await request.formData();
            for(let [key, value] of formData){
                out[key] = value;
            }
        }
        return out;
    }
};
