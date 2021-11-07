
import yaml from 'js-yaml'; // pinstripe-if-client: const yaml = undefined;

import { Base } from './base.js';
import { Registrable } from './registrable.js';
import { overload } from './overload.js';
import { thatify } from './thatify.js';
import { addFileToClient } from './client.js'; // pinstripe-if-client: const addFileToClient = () => {};
import { VirtualNode } from './virtual_node.js'

export const View = Base.extend().include({
    meta(){
        this.include(Registrable)
        this.assignProps({
            render(...args){
                return this.create(...args).render();
            }
        });
    },

    initialize(environment){
        this.environment = environment;
    },

    render(){
        
    },

    __getMissing(name){
        return this.environment[name];
    }
});

export const defineView = overload({
    ['string, object'](name, include){
        const abstract = include.abstract;
        delete include.abstract;
        View.register(name, abstract).include(include);
    },

    ['string, function'](name, fn){
        defineView(name, { render: thatify(fn) });
    }
});

export const viewImporter = dirPath => {
    const files = [];

    addFileToClient(`${dirPath}/_importer.client.js`, () => {
        const filteredFiles = files.filter(({ filePath }) => filePath.match(/\.client\.js$/));

        return `
            import { defineView } from 'pinstripe';

            ${filteredFiles.map(({ filePath, relativeFilePathWithoutExtension }, i) => {
                const importName = `definition${i + 1}`;

                return `
                    import ${importName} from ${JSON.stringify(filePath)};
                    defineView(${JSON.stringify(relativeFilePathWithoutExtension)}, ${importName});
                `;
            }).join('')}
        `;
    });

    return async filePath => {
        const relativeFilePath = filePath.substr(dirPath.length).replace(/^\//, '');
        const relativeFilePathWithoutExtension = relativeFilePath.replace(/\.[^/]+$/, '');

        if(filePath.match(/\.js$/)){
            if(relativeFilePathWithoutExtension == '_importer'){
                return;
            }
            addFileToClient(filePath);
            const definition = await ( await import(filePath) ).default;
            if(definition !== undefined){
                files.push({ filePath, relativeFilePathWithoutExtension });
                defineView(relativeFilePathWithoutExtension, definition);
            }
            return;
        }

        if(filePath.match(/\.md$/)){

            const params = {};

            defineView(relativeFilePathWithoutExtension, async ({ renderView, readFile, renderMarkdown, renderHtml }) => {
                if(!params.body){
                    let markdown = (await readFile(filePath)).toString();

                    const matches = markdown.match(/^---+([\s\S]+?)---+([\s\S]*)$/);
                    if(matches){
                        Object.assign(params, yaml.load(matches[1]));
                        markdown = matches[2];
                    }

                    params.body = await renderHtml`
                        <div class="content">
                            ${renderMarkdown(markdown)}
                        </div>
                    `;
                    
                    if(!params.title){
                        params.title = extractTitle(params.body.toString());
                    }
                }
                return renderView('_layout', params);
            });
            return;
        }

        defineView(relativeFilePath, ({ renderFile }) => renderFile(filePath));
    };
};

const extractTitle = html => {
    let out;
    VirtualNode.fromString(html).traverse(node => {
        console.log('node.type', node.type)
        if(node.type == 'h1'){
            out = node.text;
        }
    });
    return out;
}