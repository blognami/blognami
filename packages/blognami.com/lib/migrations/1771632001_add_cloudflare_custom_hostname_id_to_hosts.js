
export default {
    async migrate(){
        await this.database.table('hosts', async hosts => {
            await hosts.addColumn('cloudflareCustomHostnameId', 'string');
        });
    }
};
