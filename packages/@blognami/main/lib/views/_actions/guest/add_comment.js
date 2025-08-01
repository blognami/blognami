
export default {
    async render(){
        if(await this.isSignedOut){
            return this.renderRedirect({
                url: `/_actions/guest/sign_in?title=${encodeURIComponent('Add comment')}&returnUrl=${encodeURIComponent(`/_actions/guest/add_comment?commentableId=${this.params.commentableId}`)}`
            });
        }

        return this.renderForm(this.database.comments, {
            fields: ['commentableId', { name: 'userId', value: await this.user.id }, { name: 'body', type: '_markdown_editor'}],
            success: this.success.bind(this)
        });
    },

    async success({ id }){
        this.notifyUsers({ commentId: id, currentUserId: await this.user.id, baseUrl: this.params._url });

        return this.renderRedirect({ target: '_top' });
    },

    async notifyUsers({ commentId, currentUserId, baseUrl }){
        await this.runInNewWorkspace(async function (){
            const comment = await this.database.comments.where({ id: commentId }).first();
            if(!comment) return;
            const commentable = await comment.commentable;
            const { title, slug } = await commentable.rootCommentable;
            const url = new URL(`/${slug}`, baseUrl);

            if(commentable.constructor.name == 'comment'){
                const commentableUser = await commentable.user;

                if(commentableUser.id != currentUserId) await commentableUser.notify(({ line }) => {
                    line(`A new comment reply has been added to "${title}":`);
                    line();
                    line(`  * ${url}`);
                });

                for(const user of await comment.commentable.comments.user.where({ idNe: currentUserId }).where({ idNe: commentableUser.id  }).all()){
                    await user.notify(({ line }) => {
                        line(`A new comment reply has been added to "${title}":`);
                        line();
                        line(`  * ${url}`);
                    });
                }
            } else {
                for(const user of await this.database.users.where({ idNe: currentUserId, role: 'admin' }).all()){
                    await user.notify(({ line }) => {
                        line(`A new comment has been added to "${title}":`);
                        line();
                        line(`  * ${url}`);
                    });
                }
            }
        });
    }
};
