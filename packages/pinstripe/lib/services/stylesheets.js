
export default async ({ viewNames, environment }) => {
    const app = await environment.app;
    const prefixStylesheets = [
        'stylesheets/vars.css',
        'stylesheets/reset.css',
        'stylesheets/global.css',
    ];
    const componentStylesheetViewNames = viewNames.filter(viewName => {
        const isCss = viewName.match(/\.css$/);
        const isNotPrefixStylesheet = !prefixStylesheets.includes(viewName.replace(/^[^\/]*\//, ''))
        const isAppView = viewName.startsWith(`${app}/`);
        return isCss && isNotPrefixStylesheet && isAppView;
    }).map(viewName => viewName.replace(/^[^\/]*\//, ''))
    return [ ...prefixStylesheets, ...componentStylesheetViewNames ];
};
