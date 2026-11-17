export default {
    async run(){
        const user = await this.database.users.insert({
            name: 'Admin',
            email: 'admin@example.com',
            role: 'admin'
        });

        await this.database.posts.insert({
            userId: user.id,
            title: 'Seeded post title',
            slug: 'seeded-post',
            body: 'Seeded post body.',
            published: true
        });
    }
};
