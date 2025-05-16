
export default {
    async render(){
        const post = await this.database.posts.where({ id: this.params.id }).first();

        return this.renderForm(this.createModel({}), {
            title: 'Publish post',
            fields: [
                { name: 'notifySubscribers', type: 'checkbox', label: 'Notify subscribers', value: true }
            ],
            submitTitle: 'Publish',
            width: 'small',

            success: async ({ notifySubscribers }) => {
                await post.update({
                    published: true
                });

                if(notifySubscribers == 'true') this.notifySubscribers();

                return this.renderRedirect({ target: '_top' });
            },
        });
    },

    async notifySubscribers(){
        const { id, _url: baseUrl } = this.params;
        await this.runInNewWorkspace(async function (){
            const post = await this.database.posts.where({ id }).first();
            if(!post) return;
            const { title, slug, access } = post;
            const url = new URL(`/${slug}`, baseUrl);
            const membershipTiers = ['yearly', 'monthly'];
            if(access != 'paid') membershipTiers.push('free');

            let page = 1;
            while(true){
                const users = await this.database.users.where({ membershipTier: membershipTiers }).paginate(page, 100).all();
                if(users.length == 0) break;
                for(const user of users){
                    await user.notify(({ line }) => {
                        line(`A new post with title "${title}" has been published:`);
                        line();
                        line(`  * ${url}`);
                    });
                }
                page++;
            }
        });
    }
};
