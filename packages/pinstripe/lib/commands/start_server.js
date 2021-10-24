
import http from 'http';
import Busboy from 'busboy';
import { default as qs} from 'qs';
const { parse: parseQueryString } = qs;

import { defineCommand } from 'pinstripe';

import { project } from '../project.js';
import { writeFile } from 'fs';
import { promisify } from 'util';

defineCommand('start-server', async ({ fetch }) => {
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
            response.setHeader('Content-Type', 'text/plain');
            response.end((e.stack || e).toString());
        }
        console.log(`${request.method}: ${request.url} (${response.statusCode})`);
    }).listen(port, host, () => {
        console.log(`Pinstripe running at http://${host}:${port}/`)
    });
});

const extractParams = async (request) => {
    const { method, url, headers } = request;
    const matches = url.match(/^([^\?]+)\?(.*)$/);
    const path = matches ? matches[1] : url;
    const queryString = parseQueryString(matches ? matches[2] : "");
    const body = method.match(/^POST|PUT|PATCH$/) ? await parseBody(request) : {};
    
    return {
        ...queryString,
        ...body,
        _method: method,
        _path: path,
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