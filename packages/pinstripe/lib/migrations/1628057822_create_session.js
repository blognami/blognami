
export default async ({ sessions }) => {
    
    await sessions.addColumn('passString', 'string');
    await sessions.addColumn('userId', 'foreign_key');
    await sessions.addColumn('lastAccessedAt', 'datetime', { index: true });
    
};
