
import { Base } from './base.js';
import { Registrable } from './registrable.js';
import { overload } from './overload.js';
import { thatify } from './thatify.js';
import { addFileToClient } from './client.js'; // pinstripe-if-client: const addFileToClient = () => {};

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

        let matches = relativeFilePath.match(/^(.*)(\.client\.js|\.js)$/);
        if(matches){
            const relativeFilePathWithoutExtension = matches[1];
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

        defineView(relativeFilePath, ({ renderFile }) => renderFile(filePath));
    };
};
