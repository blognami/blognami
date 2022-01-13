
import { Base } from './base.js';
import { Registrable } from './registrable.js';
import { dasherize } from './inflector.js';
import { overload } from './overload.js';
import { addFileToClient } from './client.js'; // pinstripe-if-client: const addFileToClient = () => {};

export const Decorator = Base.extend().include({
    meta(){
        this.include(Registrable);

        const { register } = this;

        this.assignProps({
            register(name, abstract){
                return register.call(this, dasherize(name), abstract);
            }
        });
    },

    initialize(nodeWrapper){
        this.nodeWrapper = nodeWrapper;
    },
    
    decorate(nodeWrapper){
        console.error(`No such decorator "${this.constructor.name}" exists.`);
    }
});


export const defineDecorator = overload({
    ['string, object'](name, include){
        const abstract = include.abstract;
        delete include.abstract;
        Decorator.register(name, abstract).include(include);
    },

    ['string, function'](name, decorate){
        defineDecorator(name, { decorate });
    }
});

export const decoratorImporter = dirPath => {
    const files = [];

    addFileToClient(`${dirPath}/_importer.client.js`, () => {
        const filteredFiles = files.filter(({ filePath }) => filePath.match(/\.client\.js$/));

        return `
            import { defineDecorator } from 'pinstripe';

            ${filteredFiles.map(({ filePath, relativeFilePathWithoutExtension }, i) => {
                const importName = `definition${i + 1}`;

                return `
                    import ${importName} from ${JSON.stringify(filePath)};
                    defineDecorator(${JSON.stringify(relativeFilePathWithoutExtension)}, ${importName});
                `;
            }).join('')}
        `;
    });

    return async filePath => {
        const relativeFilePath = filePath.substr(dirPath.length).replace(/^\//, '');

        if(filePath.match(/\.js$/)){
            const relativeFilePathWithoutExtension = relativeFilePath.replace(/\.[^/]+$/, '');
            if(relativeFilePathWithoutExtension == '_importer'){
                return;
            }
            addFileToClient(filePath);
            const definition = await ( await import(filePath) ).default;
            if(definition !== undefined){
                files.push({ filePath, relativeFilePathWithoutExtension });
                defineDecorator(relativeFilePathWithoutExtension, definition);
            }
            return;
        }
    };
};