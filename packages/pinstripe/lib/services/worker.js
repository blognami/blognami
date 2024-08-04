
export const client = {
    create(){
        return this;
    },

    start(){
        addEventListener("install", (event) => {
            event.waitUntil(skipWaiting());
        });
    
        addEventListener("fetch", (event) => {
            console.log('------- fetch', extractParams(event.request));
            event.respondWith(fetch(event.request));
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
            _headers: headers
        };
    }
};

export default client;
