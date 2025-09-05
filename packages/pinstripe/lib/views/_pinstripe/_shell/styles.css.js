
import { View, createHash } from '../../../view.js';
import { parse as parseCss, stringify as stringifyCss } from 'css'; // pinstripe-if-client: const { parseCss, stringifyCss }  = {};
import postcss from 'postcss'; // pinstripe-if-client: const postcss = null;
import postcssOkLab from '@csstools/postcss-oklab-function'; // pinstripe-if-client: const postcssOkLab = null;
import postcssAutoprefixer from 'autoprefixer'; // pinstripe-if-client: const postcssAutoprefixer = null;
import postcssMinifySelectors from 'postcss-minify-selectors'; // pinstripe-if-client: const postcssMinifySelectors = null;

let out;

export default {
    async render(){
        if(!out){
            out = (async () => await this.transform(await this.build()))();
        }

        out = await out;
    
        return [200, { 'content-type': 'text/css'}, [ out ]];
    },

    async build(){
        const buffer = [];
        for(let viewName of View.names){
            const { filePaths } = View.for(viewName);
            for(let filePath of filePaths){
                if(!filePath.match(/\.js$/)) continue;
                const { styles } = await import(filePath);
                if(!styles) continue;
                const normalizedStyles = typeof styles == 'function' ? styles(await this.theme.resolveReferences()) : styles;
                const ast = parseCss(normalizedStyles);
                const hash = createHash(viewName);
                traverseCssAst(ast, ({ selectors }) => {
                    if(!Array.isArray(selectors)) return;
                    selectors.forEach((selector, i) => {
                        selectors[i] = selector.replace(/(^|[^\\])\./g, `$1.view-${hash}-`);
                    });
                });
                buffer.push(stringifyCss(ast));
            }
        }
        return buffer.join('\n\n');
    },

    transform(styles){
        return postcss([
            postcssOkLab({ preserve: true }),
            postcssAutoprefixer,
            postcssMinifySelectors
        ]).process(styles, { from: undefined, to: undefined }).then(result => result.css);
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