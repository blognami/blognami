
import { existsSync } from 'fs';

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
                host: 'localhost',
                user: 'root',
                password: '',
                database: `${await this.project.name}_${environment}`
            }, out);
        }

        return Object.assign({
            adapter: 'sqlite',
            filename: `${await this.project.rootPath}/${environment}.db`
        }, out);
    },

    normalizeMailConfig(config){
        return {
            defaults: {},
            ...config
        };
    }
};
