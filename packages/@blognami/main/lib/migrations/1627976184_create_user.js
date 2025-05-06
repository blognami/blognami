
export default {
    async migrate(){
        await this.database.table('users', async users => {
            await users.addColumn('name', 'string');
            await users.addColumn('slug', 'string', { index: true });
            await users.addColumn('metaTitle', 'string');
            await users.addColumn('metaDescription', 'text');
            await users.addColumn('email', 'string');
            await users.addColumn('salt', 'string');
            await users.addColumn('role', 'string');
            await users.addColumn('membershipTier', 'string', { index: true, default: 'none' });
            await users.addColumn('membershipExpiresAt', 'datetime');
            await users.addColumn('lastSuccessfulSignInAt', 'datetime');
            await users.addColumn('lastFailedSignInAt', 'datetime');
            await users.addColumn('emailNotificationFrequency', 'string', { default: 'asap' });
            await users.addColumn('emailNotificationLastSentAt', 'datetime');
            await users.addColumn('emailNotificationScheduledAt', 'datetime');
        });  
    }
};
