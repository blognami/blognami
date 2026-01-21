
export default {
    async run(){
        const { postId, baseUrl } = this.params;

        const post = await this.database.posts.where({ id: postId }).first();
        if(!post) return;

        const { title, slug, access } = post;
        const site = await this.database.site;
        const postUrl = new URL(`/${slug}`, baseUrl);

        const tiers = ['paid'];
        if(access != 'paid') tiers.push('free');

        let page = 1;
        while(true){
            const users = await this.database.users.where({ subscriptions: { tier: tiers } }).paginate(page, 100).all();
            if(users.length == 0) break;

            for(const user of users){
                const html = await this.renderView('_post_email', { post, user, site, postUrl });

                await user.sendMail({
                    subject: `${site.title}: ${title}`,
                    html
                });
            }
            page++;
        }
    }
};
