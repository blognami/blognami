
import { execSync, spawnSync } from 'child_process';

export default {
    async run(){
        const { adapter, ...databaseConfig } = await this.config.database;
        const { rootPath } = await this.project;

        if(adapter == 'mysql'){
            execSync(`echo "drop database ${databaseConfig.database}" | mysql -h 127.0.0.1 -u root`, );
            execSync(`echo "create database ${databaseConfig.database}" | mysql -h 127.0.0.1 -u root`);
            execSync(`mysql ${databaseConfig.database} -h 127.0.0.1 -u root <  ${rootPath}/dump.sql`);
        } else {
            execSync(`rm -f ${databaseConfig.filename}`);
            execSync(`echo '.read ${rootPath}/dump.sql' | sqlite3 ${databaseConfig.filename}`);
        }
    }
};
