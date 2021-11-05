
import { Base } from './base.js';
import { Registrable } from './registrable.js';
import { AsyncPathBuilder } from './async_path_builder.js';
import { camelize } from './inflector.js';
import { overload } from './overload.js';
import { thatify } from './thatify.js';
import { addFileToClient } from './client.js'; // pinstripe-if-client: const addFileToClient = () => {};

export const ServiceFactory = Base.extend().include({
    meta(){
        this.include(Registrable);

        const { register, create } = this;

        this.assignProps({
            register(name){
                return register.call(this, camelize(name));
            },

            scope: 'current',

            create(name, { parentEnvironment, environment }){
                if(this.for(name).scope == 'root' && parentEnvironment !== undefined){
                    return parentEnvironment[name];
                } else {
                    const instance = create.call(this, name, environment).create();
                    if(instance != undefined && typeof instance.then == 'function'){
                        return AsyncPathBuilder.new(instance);
                    }
                    return instance;
                }
            }
        });
    },

    initialize(environment){
        this.environment = environment;
    },
    
    create(){
        return this;
    },

    __getMissing(name){
        return this.environment[name];
    }
});

export const defineService = overload({
    ['string, object'](name, include){
        const abstract = include.abstract;
        delete include.abstract;
        ServiceFactory.register(name, abstract).include(include);
    },

    ['string, function'](name, fn){
        defineService(name, { create: thatify(fn) });
    }
});

export const serviceImporter = dirPath => {
    const files = [];

    addFileToClient(`${dirPath}/_importer.client.js`, () => {
        const filteredFiles = files.filter(({ filePath }) => filePath.match(/\.client\.js$/));

        return `
            import { defineService } from 'pinstripe';

            ${filteredFiles.map(({ filePath, relativeFilePathWithoutExtension }, i) => {
                const importName = `definition${i + 1}`;

                return `
                    import ${importName} from ${JSON.stringify(filePath)};
                    defineService(${JSON.stringify(relativeFilePathWithoutExtension)}, ${importName});
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
                defineService(relativeFilePathWithoutExtension, definition);
            }
            return;
        }
    };
};