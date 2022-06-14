
export default async ({ users }) => {
    
    await users.addColumn('name', 'string');
    await users.addColumn('email', 'string');
    await users.addColumn('salt', 'string');
    await users.addColumn('role', 'string');
    await users.addColumn('lastSuccessfulSignInAt', 'datetime');
    await users.addColumn('lastFailedSignInAt', 'datetime');
};
