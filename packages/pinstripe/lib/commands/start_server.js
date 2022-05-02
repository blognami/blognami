
import http from 'http';
import Busboy from 'busboy';
import { Url } from '../url.js';

export default async ({ fetch, bot }) => {
    const host = process.env.HOST || '127.0.0.1';
    const port = process.env.PORT || 3000;

    http.createServer(async (request, response) => {
        try {
            const params = await extractParams(request);
            const [ status, headers, body ] = await fetch(params);
            response.statusCode = status
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
        console.log(`Pinstripe running at http://${host}:${port}/`)
    });

    bot.start();

    return new Promise(() => {});
};

const extractParams = async (request) => {
    const { method, url, headers } = request;
    const _url = Url.fromString(url);
    if(headers['x-host']) _url.host = headers['x-host'];
    const body = method.match(/^POST|PUT|PATCH$/) ? await parseBody(request) : {};
    
    return {
        ..._url.params,
        ...body,
        _method: method,
        _url,
        _headers: headers
    };
};

const parseBody = (request) => new Promise((resolve) => {
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