
import { View, createHash } from 'blognami';
import { parse as parseCss, stringify as stringifyCss } from 'css'; // blognami-if(client): const { parseCss, stringifyCss }  = {};
import postcss from 'postcss'; // blognami-if(client): const postcss = null;
import postcssOkLab from '@csstools/postcss-oklab-function'; // blognami-if(client): const postcssOkLab = null;
import postcssAutoprefixer from 'autoprefixer'; // blognami-if(client): const postcssAutoprefixer = null;
import postcssMinifySelectors from 'postcss-minify-selectors'; // blognami-if(client): const postcssMinifySelectors = null;

let out;

export default {
    create(){
        return this.defer(() => this);
    },

    async build(){
        if(!out){
            out = (async () => await this.transformCss(await this.concatenateStyles()))();
        }

        out = await out;

        return out;
    },

    async concatenateStyles(){
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
                this.traverseCssAst(ast, ({ selectors }) => {
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

    transformCss(styles){
        return postcss([
            postcssOkLab({ preserve: true }),
            postcssAutoprefixer,
            postcssMinifySelectors
        ]).process(styles, { from: undefined, to: undefined }).then(result => result.css);
    },

    traverseCssAst(node, fn){
        if(Array.isArray(node)){
            node.forEach(item => this.traverseCssAst(item, fn));
        } else if(typeof node == 'object'){
            Object.values(node).forEach(item => this.traverseCssAst(item, fn));
            fn(node);
        }
    }
};
