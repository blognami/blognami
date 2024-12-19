import { Class } from "./class.js";

export const HttpProxy = Class.extend().include({

    initialize(){
        this.worker = new Worker("/_pinstripe/_shell/javascripts/worker.js");
        this.session = {};
        this.sessionIdCounter = 0;

        this.worker.onmessage = (event) => {
            const [sessionId, response ] = event.data;
            const session = this.session[sessionId];
            if(!session) return;
            clearTimeout(session.timeout);
            delete this.session[sessionId];
            session.resolve(response);
        };
    },

    async fetch(...args){
        const request = new Request(...args);
        const request1 = request.clone();
        const request2 = request.clone();
        const params = await this.extractParams(request1);
        const [ status, headers, body ] = await new Promise((resolve, reject) => {
            const sessionId = this.sessionIdCounter++;
            const timeout = setTimeout(() => {
                reject(new Error('Timeout'));
            }, 10000);
            this.session[sessionId] = { resolve, reject, timeout };
            this.worker.postMessage([ sessionId, params ]);
        });
        if(status >= 200 && status < 300) return new Response(body, { status, headers });
        return fetch(request2);
    },

    async extractParams(request){
        return {
            ...(await this.extractUrlParams(request)),
            ...(await this.extractBodyParams(request)),
            _method: request.method,
            _url: this.extractUrl(request).toString(),
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
});