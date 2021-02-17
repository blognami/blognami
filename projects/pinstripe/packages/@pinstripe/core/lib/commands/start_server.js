
import http from 'http';
import parseBody from 'co-body';
import { default as qs} from 'qs';
const { parse: parseQueryString } = qs;

import { Command } from '../command.js';

Command.register('start-server').define(dsl => dsl
    .serviceProps('fetch')
    .props({
        run(){
            const host = process.env.HOST || '127.0.0.1';
            const port = process.env.PORT || 3000;

            http.createServer(async (request, response) => {
                try {
                    const params = await extractParams(request);
                    const [status, headers, body] = await this.fetch(params);
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
        }
    })
);

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
