
export default async ({ users }) => {
    
    await users.addColumn('name', 'string');
    await users.addColumn('email', 'string');
    await users.addColumn('encryptedPassword', 'string');
    await users.addColumn('role', 'string');
    
};
