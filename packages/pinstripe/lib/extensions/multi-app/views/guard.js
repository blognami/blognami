
export default ({ params, fetch }) => {
    const app = params._headers['x-app'];
    const { _url } = params;
    if(!app || _url.path.match(/^\/assets\//)) return;
    _url.path = `/apps/${app}${_url.path}`;
    return fetch(params);
}
