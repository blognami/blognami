
import { Url } from '../url.js'

export default ({ fetch, renderHtml }) => {
    return async (path = '/', params = {}) => {
        const [ status, headers, body ] = await fetch({ ...params, _path: path });
        const url = Url.new('http', 'localhost', 80, path, params).toString().replace(/http:\/\/[^\/]*/, '');
        
        return renderHtml`<div data-node-wrapper="frame" data-url="${url}">${renderHtml(body)}</div>`;
    };
};
