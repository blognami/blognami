
export default {
    async render(){
        const post = await this.database.posts.where({ id: this.params.id }).first();

        return this.renderForm(this.createModel({}), {
            title: 'Publish post',
            fields: [
                { name: 'emailSubscribers', type: 'checkbox', label: 'Email subscribers', value: true }
            ],
            submitTitle: 'Publish',
            width: 'small',

            success: async ({ emailSubscribers }) => {
                await post.update({
                    published: true
                });

                if(emailSubscribers == 'true'){
                    await this.jobQueue.push('emailPostToSubscribers', {
                        postId: post.id,
                        baseUrl: this.params._url.origin
                    });
                }

                return this.renderRedirect({ target: '_top' });
            },
        });
    }
};
