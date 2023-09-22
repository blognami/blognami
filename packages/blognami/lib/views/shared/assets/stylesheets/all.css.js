
let out;

const prefixStylesheets = [
    'assets/stylesheets/vars.css',
    'assets/stylesheets/reset.css',
    'assets/stylesheets/global.css',
    'assets/stylesheets/view.css',
];

export default {
    render(){
        if(!out){
            const suffixStylesheets = this.app.viewNames.filter(viewName => {
                if(viewName == 'assets/stylesheets/all.css') return false;
                if(!viewName.match(/^assets\/stylesheets\/.*\.css$/)) return false;
                if(prefixStylesheets.includes(viewName)) return false;
                return true;
            });
            out = [ ...prefixStylesheets, ...suffixStylesheets ].map(stylesheet => {
                return `@import "/${stylesheet}";`
            }).join('\n');
        }
    
        return [200, { 'content-type': 'text/css'}, [ out ]];
    }
};