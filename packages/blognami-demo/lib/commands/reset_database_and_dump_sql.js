
import { execSync } from 'child_process';

export default {
    async run(){
        const { adapter, ...databaseConfig } = await this.config.database;
        const { rootPath } = await this.project;

        execSync(`pinstripe reset-database`);

        if(adapter == 'mysql'){
            execSync(`mysqldump ${databaseConfig.database} -h 127.0.0.1 -u root > ${rootPath}/dump.sql`);
        } else {
            execSync(`echo '.dump' | sqlite3 ${databaseConfig.filename} > ${rootPath}/dump.sql`);
        }
    }
};
