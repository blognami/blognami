export default {
    meta(){
        this.addHook('initializeMenus', async function(){
            // Admin-only post links
            if (await this.isSignedIn && (await this.user).role === 'admin') {
                this.addMenuItem('user', 'Add', {
                    label: 'Post',
                    url: '/_actions/admin/add_post',
                    target: '_overlay',
                    testId: 'add-post'
                });

                this.addMenuItem('user', 'Find', {
                    label: 'Post',
                    url: '/_actions/admin/find_post',
                    target: '_overlay',
                    testId: 'find-post'
                });
            }

            // Add individual tags with post count badges
            const tags = await this.database.posts.tags.orderBy('name').all();

            for (const tag of tags) {
                const count = await this.database.posts.where({ tags: { name: tag.name } }).count();
                const badgeText = count === 1 ? '1 post' : `${count} posts`;

                this.addMenuItem('content', 'Tags', {
                    label: tag.name,
                    url: `/${tag.slug}`,
                    badge: badgeText
                });
            }
        });
    }
};
