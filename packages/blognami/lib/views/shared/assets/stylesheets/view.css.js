
import { View, createHash } from '../../../../view.js';
import { parse as parseCss, stringify as stringifyCss } from 'css'; // blognami-if-client: const { parseCss, stringifyCss }  = {};

let out;

export default {
    async render(){
        if(!out){
            const buffer = [];
            for(let viewName of this.app.viewNames){
                const resolvedViewName = this.app.viewMapper.resolveView(viewName);
                const { filePaths } = View.for(resolvedViewName);
                for(let filePath of filePaths){
                    if(!filePath.match(/\.js$/)) continue;
                    const { styles } = await import(filePath);
                    if(!styles) continue;
                    const ast = parseCss(styles);
                    const hash = createHash(resolvedViewName);
                    traverseCssAst(ast, ({ selectors }) => {
                        if(!Array.isArray(selectors)) return;
                        selectors.forEach((selector, i) => {
                            selectors[i] = selector.replace(/(^|[^\\])\./g, `$1.view-${hash}-`);
                        });
                    });
                    buffer.push(stringifyCss(ast));
                }
            }
            out = buffer.join('');
        }
    
        return [200, { 'content-type': 'text/css'}, [ out ]];
    }
};

function traverseCssAst(node, fn){
    if(Array.isArray(node)){
        node.forEach(item => traverseCssAst(item, fn));
    } else if(typeof node == 'object'){
        Object.values(node).forEach(item => traverseCssAst(item, fn));
        fn(node);
    }
}