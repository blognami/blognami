
export default ({ viewNames }) => {
    const nonComponentStylesheetViewNames = [
        'stylesheets/vars.css',
        'stylesheets/reset.css',
        'stylesheets/global.css',
    ];
    const componentStylesheetViewNames = viewNames.filter(viewName => viewName.match(/\.css$/) && !nonComponentStylesheetViewNames.includes(viewName))
    return [ ...nonComponentStylesheetViewNames, ...componentStylesheetViewNames ];
};
