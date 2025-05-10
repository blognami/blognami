
export default {
    async render(){
        this.post = await this.database.posts.where({ id: this.params.id }).first();

        return this.renderForm(this.createModel({}), {
            title: 'Publish post',
            fields: [
                { name: 'notifySubscribers', type: 'checkbox', label: 'Notify subscribers', value: true }
            ],
            submitTitle: 'Publish',
            width: 'small',

            success: async ({ notifySubscribers }) => {
                await this.post.update({
                    published: true
                });

                if(notifySubscribers == 'true') this.notifySubscribers();

                return this.renderHtml`
                    <span data-component="pinstripe-anchor" data-target="_top"><script type="pinstripe">this.parent.trigger('click');</script></span>
                `;
            },
        });
    },

    async notifySubscribers(){
        const { title, slug, access } = await this.post;
        const url = new URL(`/${slug}`, this.params._url);
        const membershipTiers = ['yearly', 'monthly'];
        if(access != 'paid') membershipTiers.push('free');

        await this.runInNewWorkspace(async function (){
            let page = 1;
            while(true){
                const users = this.users.where({ membershipTier: membershipTiers }).paginate(page, 100).all();
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
