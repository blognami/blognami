
import http from 'http';
import Busboy from 'busboy';
import { createHash } from 'crypto';

export default {
    create(){
        return this;
    },

    start(apps = [{ name: 'main', host: '127.0.0.1', port: 3000 }]){
        apps.forEach(({ name, host, port }) => {
            const isTest = process.env.NODE_ENV == 'test';

            http.createServer(async (request, response) => {
                try {
                    const params = await this.extractParams(request);
                    if(!params._headers['x-app']) params._headers['x-app'] = name;

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
                    response.end((e.stack || e).toString());
                }
                if(!isTest) console.log(`${request.method}: ${request.url} (${response.statusCode})`);
            }).listen(port, host, () => {
                if(!isTest) console.log(`Pinstripe running "${name}" app at "http://${host}:${port}/"`)
            });
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
    },

    parseBody(request){
        return new Promise((resolve) => {
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
        });
    },

    createHash(data){
        return createHash('sha1').update(JSON.stringify(data)).digest('base64');
    }
};
