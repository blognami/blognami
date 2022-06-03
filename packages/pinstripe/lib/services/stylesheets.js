
export default async ({ viewNames }) => {
    const prefixStylesheets = [
        'stylesheets/vars.css',
        'stylesheets/reset.css',
        'stylesheets/global.css',
    ];
    const componentStylesheetViewNames = viewNames.filter(viewName => {
        const isCss = viewName.match(/\.css$/);
        const isNotPrefixStylesheet = !prefixStylesheets.includes(viewName.replace(/^[^\/]*\//, ''));
        return isCss && isNotPrefixStylesheet;
    });
    return [ ...prefixStylesheets, ...componentStylesheetViewNames ];
};
