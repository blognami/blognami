
import { existsSync } from 'fs';
import { resolve, isAbsolute } from 'path';

let createConfigPromise;

export default {
    create(){
        return this.defer(() => {
            if(!createConfigPromise){
                createConfigPromise = this.createConfig();
            }
            return createConfigPromise;
        });
    },

    async createConfig(){
        let out = {};
        const candidateConfigFilePath = `${await this.project.rootPath}/pinstripe.config.js`;
        if(existsSync(candidateConfigFilePath)){
            out = await (await import(candidateConfigFilePath)).default;
        }

        const { 
            database = { adapter: 'sqlite' },
            mail = { adapter: 'dummy' },
            server = {}
        } = out;
        
        return {
            ...out,
            database: await this.normalizeDatabaseConfig(database),
            mail,
            server: this.normalizeServerConfig(server)
        };
    },

    async normalizeDatabaseConfig(config){
        const out = { ...config };

        const { adapter } = out;

        const environment = process.env.NODE_ENV || 'development';

        if(adapter == 'mysql'){
            return Object.assign({
                host: '127.0.0.1',
                user: 'root',
                password: '',
                database: `${this.inflector.snakeify(await this.project.name)}_${environment}`
            }, out);
        }

        let filename = out.filename || `${environment}.db`;
        if(!isAbsolute(filename)){
            filename = resolve(`${await this.project.rootPath}/${filename}`);
        }

        return Object.assign({ adapter: 'sqlite' }, out, { filename });
    },

    normalizeMailConfig(config){
        return {
            defaults: {},
            ...config
        };
    },

    normalizeServerConfig(config){
        config.limits ||= {};
        config.limits.bodySize ||= 100 * 1024 * 1024;
        config.limits.rawBodySize ||= 1024 * 1024;
        config.limits.fieldNameSize ||= 100;
        config.limits.fieldSize ||= 1024 * 1024;
        config.limits.fields ||= Infinity;
        config.limits.fileSize ||= 10 * 1024 * 1024;
        config.limits.files ||= Infinity;
        config.limits.parts ||= Infinity;
        config.limits.headerPairs ||= 2000;
        config.limits.imageWidth ||= 1024;
        config.limits.imageHeight ||= 1024;
        return config;
    }
};
