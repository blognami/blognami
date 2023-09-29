
import { promisify } from 'util'; // haberdash-if-client: const promisify = undefined;
import { readFile } from 'fs'; // haberdash-if-client: const readFile = undefined;
import { default as mimeTypes } from 'mime-types'; // haberdash-if-client: const mimeTypes = undefined;
import { createHash } from 'crypto'; // haberdash-if-client: const createHash = undefined;
import { parse as parseCss, stringify as stringifyCss } from 'css'; // haberdash-if-client: const { parseCss, stringifyCss }  = {};

import { Class } from './class.js';
import { Registry } from './registry.js';
import { ServiceConsumer } from './service_consumer.js';
import { trapify } from './trapify.js'

export const View = Class.extend().include({
    meta(){
        this.assignProps({ name: 'View' });

        this.include(Registry);
        this.include(ServiceConsumer);
        
        this.assignProps({
            run(context, name, fn){
                return context.fork().run(async context => {
                    context.view = await this.create(name, context);
                    return fn.call(context.view, context.view);
                });
            },

            render(context, name, params = {}){
                return this.run(context, name, view => {
                    view.context.params = params;
                    return view.render();
                });
            },

            renderStyles(context, name){
                return this.run(context, name, view => {
                    const { styles, hash } = view;
                    if(!styles) return;
                    const ast = parseCss(styles);
                    traverseCssAst(ast, ({ selectors }) => {
                        if(!Array.isArray(selectors)) return;
                        selectors.forEach((selector, i) => {
                            selectors[i] = selector.replace(/(^|[^\\])\./g, `$1.view-${hash}-`);
                        });
                    });
                    return stringifyCss(ast);
                });
            },

            mapperFor(namespaces = []){
                const cacheKey = JSON.stringify(namespaces);
                if(!this.cache.mappers) this.cache.mappers = {};
                if(!this.cache.mappers[cacheKey]){
                    const map = {};
                    namespaces.forEach(namespace => {
                        this.names.forEach(name => {
                            const pattern = new RegExp(`^${namespace}/(.*)$`);
                            const matches = name.match(pattern);
                            if(!matches) return;
                            map[matches[1]] = name;
                        })
                    });
                    
                    this.cache.mappers[cacheKey] = Class.extend().include({
                        isView(name){
                            return !!map[name];
                        },

                        renderView(context, name, params = {}){
                            return View.render(context, map[name], params);
                        },

                        resolveView(viewName){
                            return map[viewName];
                        },

                        get viewNames(){
                            return Object.keys(map).sort();
                        }
                    }).new();
                }
                return this.cache.mappers[cacheKey];
            }
        });

        const registry = this;

        this.FileImporter.include({
            importFile({ relativeFilePath, filePath }){
                registry.register(relativeFilePath, {
                    meta(){
                        this.filePaths.push(filePath);
                    },

                    render(){
                        return renderFile(filePath);
                    }
                });
            }
        });
    },

    get hash(){
        if(!this._hash){
            this._hash = createHash('sha1').update(this.constructor.name).digest('base64').replace(/[^a-z0-9]/ig, '').replace(/^(.{10}).*$/, '$1');
        }
        return this._hash;
    },

    get cssClasses(){
        return trapify({
            __getMissing: (target, name) => `view-${this.hash}-${this.inflector.dasherize(name)}`
        });
    },
    
    render(){
        // by default do nothing
    }
});

const renderFile = async filePath => [
    200,
    { 'content-type': mimeTypes.lookup(filePath) || 'application/octet-stream' },
    [ await promisify(readFile)(filePath) ]
];

function traverseCssAst(node, fn){
    if(Array.isArray(node)){
        node.forEach(item => traverseCssAst(item, fn));
    } else if(typeof node == 'object'){
        Object.values(node).forEach(item => traverseCssAst(item, fn));
        fn(node);
    }
}
