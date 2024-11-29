
import http from 'http';
import Busboy from 'busboy';
import { createHash } from 'crypto';

export default {
    create(){
        return this;
    },

    start(options = {}){
        const {  host = '127.0.0.1', port = 3000 } = options;

        const isTest = process.env.NODE_ENV == 'test';

        const baseUrl = new URL(`http://${host}:${port}/`);

        http.createServer(async (request, response) => {
            try {
                const params = await this.extractParams(request, baseUrl);

                const [ status, headers, body ] = await this.callHandler.handleCall(params);

                const etag = this.createHash(body);

                if(params._headers['if-none-match'] == etag){
                    response.statusCode = 304;
                    response.end();
                    return;
                }
                
                headers.etag = etag;

                response.statusCode = status;
                Object.keys(headers).forEach(
                    (name) => response.setHeader(name, headers[name])
                )
                body.forEach(chunk => response.write(chunk));
                response.end();
            } catch (e){
                response.statusCode = 500;
                response.setHeader('content-type', 'text/plain');
                const error = (e.stack || e).toString();
                console.error(error);
                response.end(error);
            }
            if(!isTest) console.log(`${request.method}: ${request.url} (${response.statusCode})`);
        }).listen(port, host, () => {
            if(!isTest) console.log(`Pinstripe running at "http://${host}:${port}/"`)
        });
    },

    async extractParams(request, baseUrl){
        const { method, url, headers } = request;
        const _url = new URL(url, baseUrl);

        const urlParams = {};
        _url.searchParams.forEach((value, key) => {
            urlParams[key] = value;
        });

        const body = method.match(/^POST|PUT|PATCH$/) ? await this.parseBody(request) : {};
        
        return {
            ...urlParams,
            ...body,
            _request: request,
            _method: method,
            _url,
            _headers: headers
        };
    },

    async parseBody(request){
        const contentType = request.headers['content-type'] || '';

        const promises = [];
        
        promises.push(new Promise((resolve) => {
            const chunks = [];
            request.on('data', chunk => chunks.push(chunk));
            request.on('end', () => {
                const _body = Buffer.concat(chunks).toString();
                resolve(contentType.match(/application\/json/) ? { _body, ...JSON.parse(_body)} : { _body });
            });
        }));

        if(contentType.match(/multipart\/(form-data|x-www-form-urlencoded)/)) promises.push(new Promise((resolve) => {
            const out = {};
            const busboy = Busboy({ headers: request.headers });
        
            busboy.on('file', function(fieldname, file, info) {
                const { filename, mimeType, encoding } = info;
                
                const chunks = [];
        
                file.on('data', chunk => {
                    chunks.push(Buffer.from(chunk));
                });
        
                file.on('end', () => {
                    out[fieldname] = {
                        filename,
                        encoding,
                        mimeType,
                        data: Buffer.concat(chunks)
                    };
                });
            });
        
            busboy.on('field', (fieldname, value) => {
                out[fieldname] = value
            });
        
            busboy.on('finish', () => resolve(out));
        
            request.pipe(busboy);
        }));

        const results = await Promise.all(promises);

        return Object.assign({}, ...results);
    },

    createHash(data){
        return createHash('sha1').update(JSON.stringify(data)).digest('base64');
    }
};
