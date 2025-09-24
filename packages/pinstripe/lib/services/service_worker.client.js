
import { MissingResourceError } from '../missing_resource_error.js';

export default {
    create(){
        return this;
    },

    start(){
        addEventListener("install", (event) => {
            event.waitUntil(skipWaiting());
        });

        addEventListener('activate', (event) => {
            event.waitUntil(clients.claim());
        });
    
        addEventListener("fetch", (event) => {
            event.respondWith((async () => {
                const request1 = event.request.clone();
                const request2 = event.request.clone();
                
                try {
                    const params = await this.extractParams(request1);
                    const [ status, headers, body ] = await this.callHandler.handleCall(params);
                    if(status >= 200 && status < 300) return new Response(body, { status, headers });
                    return fetch(request2);
                } catch (error) {
                    if(!(error instanceof MissingResourceError)) throw error;
                    console.log(error);
                    return fetch(request2);
                }
            })());
        });

        this.version.then(version => {
            console.log(`Worker started. Running version ${JSON.stringify(version)}.`);
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
        try {
            if(contentType.match(/^multipart\/form-data/)){
                const formData = await request.formData();
                for(let [key, value] of formData){
                    out[key] = value;
                }
            }
        } catch (error){}
        return out;
    }
};
