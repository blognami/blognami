
import { execSync } from 'child_process';

export default {
    async run(){
        const { adapter, ...databaseConfig } = await this.config.database;
        const { rootPath } = await this.project;

        // 1. Reset database
        execSync(`pinstripe reset-database`, {
            env: process.env,
            stdio: 'inherit'
        });

        // 2. Setup Stripe config (if STRIPE_API_KEY is set)
        const secretKey = process.env.STRIPE_API_KEY;
        if (secretKey) {
            // Get webhook secret (same for all forwarding URLs)
            const webhookSecret = execSync('stripe listen --print-secret', { encoding: 'utf8' }).trim();

            // Store in main database
            await this.runInNewWorkspace(async function() {
                await this.database.stripe.update({ secretKey, webhookSecret });
            });
        }

        // 3. Close database connection before dumping (SQLite requires this)
        await this.database.destroy();

        // 4. Dump SQL (now includes Stripe config)
        if(adapter == 'mysql'){
            execSync(`mysqldump ${databaseConfig.database} -h 127.0.0.1 -u root > ${rootPath}/dump.sql`);
        } else {
            execSync(`echo '.dump' | sqlite3 ${databaseConfig.filename} > ${rootPath}/dump.sql`);
        }
    }
};
