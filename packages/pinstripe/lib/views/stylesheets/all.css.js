
let out;

const prefixStylesheets = [
    'stylesheets/vars.css',
    'stylesheets/reset.css',
    'stylesheets/global.css',
];

export default ({ viewNames }) => {
    if(!out){
        const suffixStylesheets = viewNames.filter(viewName => {
            if(viewName == 'stylesheets/all.css') return false;
            if(!viewName.match(/^stylesheets\/.*\.css$/)) return false;
            if(prefixStylesheets.includes(viewName)) return false;
            return true;
        });
        out = [ ...prefixStylesheets, ...suffixStylesheets ].map(stylesheet => {
            return `@import "/${stylesheet}";`
        }).join('\n');
    }

    return [200, { 'content-type': 'text/css'}, [ out ]];
};