
import http from 'http';
import Busboy from 'busboy';
import { createHash } from 'crypto';

export default {
    create(){
        return this;
    },

    start(apps = [{ name: 'main', host: '127.0.0.1', port: 3000 }]){
        apps.forEach(({ name, host, port }) => {
            http.createServer(async (request, response) => {
                try {
                    const params = await this.extractParams(request);
                    if(!params._headers['x-app']) params._headers['x-app'] = name;

                    const [ status, headers, body ] = await this.fetch(params);

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
                console.log(`${request.method}: ${request.url} (${response.statusCode})`);
            }).listen(port, host, () => {
                console.log(`Pinstripe running "${name}" app at "http://${host}:${port}/"`)
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
            const busboy = new Busboy({ headers: request.headers });
        
            busboy.on('file', function(fieldname, file, filename, encoding, mimeType) {
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
