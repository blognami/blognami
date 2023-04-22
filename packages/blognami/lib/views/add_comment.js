
export default {
    async render(){
        if(await this.session){
            this.user = await this.session.user;
        }

        if(!this.user){
            return this.renderHtml`
                <span data-component="pinstripe-anchor" data-trigger="click" data-href="/sign_in?title=${encodeURIComponent('Add comment')}&redirectUrl=${encodeURIComponent(`/add_comment?commentableId=${this.params.commentableId}`)}"></span>
            `;
        }

        return this.renderForm(this.database.comments, {
            fields: ['commentableId', { name: 'userId', value: this.user.id}, { name: 'body', type: 'textarea', component: 'pinstripe-markdown-editor/anchor'}],
            success: this.success.bind(this)
        });
    },

    async success(comment){
        await this.notifyUsers(comment);

        return this.renderHtml`
            <span data-component="pinstripe-anchor" data-target="_top" data-trigger="click"></span>
        `;
    },

    async notifyUsers(comment){
        const commentable = await comment.commentable;
        const { title, slug } = await commentable.rootCommentable;
        const url = new URL(`/${slug}`, this.params._url);

        if(commentable.constructor.name == 'comment'){
            const commentableUser = await commentable.user;

            if(commentableUser.id != this.user.id) this.notifyUserOfNewCommentReply({ email: commentableUser.email, name: commentableUser.name, title, url });

            await comment.commentable.comments.user.where({ idNe: this.user.id }).where({ idNe: commentableUser.id  }).all().forEach(({ name, email}) => {
                this.notifyUserOfNewCommentReply({ email, name, title, url });
            });
        } else {
            await this.database.users.where({ idNe: this.user.id, role: 'admin' }).all().forEach(({ name, email}) => {
                this.notifyUserOfNewComment({ email, name, title, url });
            });
        }
    },

    notifyUserOfNewComment({ email, name, title, url }){
        this.runInNewWorkspace(({ sendMail }) => sendMail({ 
            to: email,
            subject: 'New comment notification',
            text: `Hi ${name},\n\nA new comment has been added to "${title}":\n\n  * ${url}`
        }));
    },

    notifyUserOfNewCommentReply({ email, name, title, url }){
        this.runInNewWorkspace(({ sendMail }) => sendMail({ 
            to: email,
            subject: 'New comment reply notification',
            text: `Hi ${name},\n\nA new comment reply has been added to "${title}":\n\n  * ${url}`
        }));
    }
};
