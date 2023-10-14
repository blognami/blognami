
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
            mail = { adapter: 'dummy' }
        } = out;
        
        return {
            ...out,
            database: await this.normalizeDatabaseConfig(database),
            mail
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
                database: `${await this.project.name}_${environment}`
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
    }
};
