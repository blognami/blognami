export default {
    async migrate(){
        await this.database.table('sites', async sites => {
            await sites.addColumn('title', 'string');
            await sites.addColumn('copyrightOwner', 'string');
            await sites.addColumn('navigation', 'text');
            await sites.addColumn('salt', 'string');
            await sites.addColumn('termsOfService', 'text');
            await sites.addColumn('privacyPolicy', 'text');
            await sites.addColumn('cookiePolicy', 'text');
        });
    }
};