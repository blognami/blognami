
export default ({ params, fetch }) => {
    const app = params._headers['x-app'];
    const { _url } = params;
    if(!app || _url.path.match(/^\/(apps\/|stylesheets\/|bundle.js)/)) return;
    _url.path = `/apps/${app}${_url.path}`;
    return fetch(params);
}
