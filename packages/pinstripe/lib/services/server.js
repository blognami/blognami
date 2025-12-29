
import http from 'http';
import Busboy from 'busboy';
import { createHash } from 'crypto';
import sharp from 'sharp';

export default {
    create(){
        return this;
    },

    start(options = {}){
        const {  hostname = '127.0.0.1', port = 3000 } = options;

        const isTest = process.env.NODE_ENV == 'test';

        const baseUrl = new URL(`http://${hostname}:${port}/`);

        http.createServer(async (request, response) => {
            try {
                const params = await this.extractParams(request, baseUrl, await this.config.server.limits);

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
        }).listen(port, hostname, () => {
            if(!isTest) console.log(`Pinstripe running at "http://${hostname}:${port}/"`)
        });
    },

    async extractParams(request, baseUrl, limits){
        const { method, url, headers } = request;
        const _url = new URL(url, baseUrl);

        const urlParams = {};
        _url.searchParams.forEach((value, key) => {
            urlParams[key] = value;
        });

        const body = method.match(/^POST|PUT|PATCH$/) ? await this.parseBody(request, limits) : {};
        
        return {
            ...urlParams,
            ...body,
            _request: request,
            _method: method,
            _url,
            _headers: headers
        };
    },

    async parseBody(request, limits){
        const errors = {};

        const contentType = request.headers['content-type'] || '';

        const promises = [];
        
        let bodySize = 0;
        const bodySizeLimit = limits.bodySize;

        promises.push(new Promise((resolve, reject) => {
            const chunks = [];
            request.on('data', chunk => {
                bodySize += chunk.length;
                if(bodySize <= bodySizeLimit) chunks.push(chunk);
                if(!errors.general && bodySize > bodySizeLimit) errors.general = `body too large - limit of ${bodySizeLimit} bytes has been reached`;
            });
            request.on('end', () => {
                let _body = Buffer.concat(chunks).toString();
                if(_body.length > limits.rawBodySize){
                    _body = `${_body.slice(0, limits.rawBodySize)}...`;
                }

                try{
                    resolve(contentType.match(/application\/json/) && bodySize <= bodySizeLimit ? { _body, ...JSON.parse(_body)} : { _body });
                } catch (e){
                    reject(e);
                }
            });
        }));

        if(contentType.match(/multipart\/(form-data|x-www-form-urlencoded)/)) promises.push(new Promise((resolve) => {
            const out = {};
            const busboy = Busboy({headers: request.headers, limits: {
                fieldNameSize: limits.fieldNameSize,
                fieldSize: limits.fieldSize,
                fields: limits.fields,
                fileSize: limits.fileSize,
                files: limits.files,
                parts: limits.parts,
                headerPairs: limits.headerPairs
            }});
        
            busboy.on('file', function(fieldname, file, info) {
                let { filename, mimeType, encoding } = info;
                
                const chunks = [];
        
                file.on('data', chunk => {
                    chunks.push(Buffer.from(chunk));
                });

                file.on('limit', () => {
                    if(!errors[fieldname]) errors[fieldname] = `file too large - limit of ${limits.fileSize} bytes has been reached`;
                });
        
                file.on('end', () => {
                    out[fieldname] = (async () => {
                        let data = Buffer.concat(chunks);

                        if(mimeType.match(/^image\/(png|jpeg|gif|webp|avif|tiff)$/)){
                            let image = sharp(data);

                            const metadata = await image.metadata();

                            image = image.resize(limits.imageWidth, limits.imageHeight, {
                                fit: 'inside',
                                withoutEnlargement: true
                            });

                            if(metadata.format == 'tiff'){
                                image = image.toFormat('webp');
                                mimeType = 'image/webp';
                                filename = filename.replace(/\.tiff$/, '.webp');
                            }

                            data = await image.toBuffer();
                        }

                        return {
                            filename,
                            encoding,
                            mimeType,
                            data
                        };
                    })();
                });
            });
        
            busboy.on('field', (fieldname, value, info) => {
                out[fieldname] = value;
                if(!errors[fieldname] && info.nameTruncated) errors[fieldname] = `name too long - limit of ${limits.fieldNameSize} bytes has been reached`;
                if(!errors[fieldname] && info.valueTruncated) errors[fieldname] = `value too long - limit of ${limits.fieldSize} bytes has been reached`;
            });

            busboy.on('partsLimit', () => {
                if(!errors.general) errors.general = `too many parts - limit of ${limits.parts} parts has been reached`;
            });

            busboy.on('filesLimit', () => {
                if(!errors.general) errors.general = `too many files - limit of ${limits.files} files has been reached`;
            });

            busboy.on('fieldsLimit', () => {
                if(!errors.general) errors.general = `too many fields - limit of ${limits.fields} fields has been reached`;
            });
        
            busboy.on('finish', () => resolve(out));
        
            request.pipe(busboy);
        }));

        const results = await Promise.all(promises);

        for (const result of results){
            for(const [key, value] of Object.entries(result)){
                result[key] = await value;
            }
        }

        if(Object.keys(errors).length) results.push({
            _bodyErrors: errors
        });

        return Object.assign({}, ...results);
    },

    createHash(data){
        return `"${createHash('sha1').update(JSON.stringify(data)).digest('base64')}"`;
    }
};
