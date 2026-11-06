
import { Table } from '../table.js';

const SCHEMA_TABLES = ['appliedMigrations', 'columnTypes'];

export default {
    meta(){
        this.annotate({
            description: 'Deletes every row and runs the seeds again, keeping the schema in place. Much faster than reset-database when the schema is already current.'
        });
    },

    async run(){
        await this.database.transaction(async () => {
            for(const name of Table.names){
                if(SCHEMA_TABLES.includes(name)) continue;
                await this.database.run(`delete from \`${name}\``);
            }
        });
        // Reload the schema as a reset would, so nothing memoized on the table classes outlives the rows.
        await this.database.reset();
        await this.runCommand('seed-database');
    }
};
