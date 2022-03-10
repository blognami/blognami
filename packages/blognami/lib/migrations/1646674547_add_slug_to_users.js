
export default async ({ database }) => {

    await database.users.addColumn('slug', 'string', { index: true });
    
};
