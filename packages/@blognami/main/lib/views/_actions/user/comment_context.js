export default {
    async render(){
        const { commentableId } = this.params;
        if(!commentableId) return;
        const commentable = await this.database.commentables.where({ id: commentableId }).first();
        if(!commentable) return;

        const post = await commentable.rootCommentable;

        let user;
        if(await this.session){
            user = await this.session.user;
        }

        const isAdmin = user?.role == 'admin';
        if(!post.published && !isAdmin) return;

        const userHasAccess = post.access == 'public' || await this.database.newsletter.isSubscribed(user, { tier: post.access });
        if(!userHasAccess) return;

        if(commentable.constructor.name == 'comment') return this.renderComment(commentable);

        return this.renderView('_content', {
            body: this.renderHtml`
                <h1>${post.title}</h1>
                ${this.renderMarkdown(post.body)}
            `
        });
    },

    async renderComment(comment){
        const commentUser = await comment.user;
        const cssClasses = this.cssClassesFor('_comments');

        return this.renderHtml`
            <div class="${cssClasses.comment}">
                <div class="${cssClasses.commentMeta}">
                    <div class="${cssClasses.commentName}">${commentUser.name}</div>
                    <div class="${cssClasses.commentCreatedAt}">${this.formatDate(comment.createdAt, `LLL dd, yyyy 'at' hh:mm a`)}</div>
                </div>
                <div class="${cssClasses.commentBody}">
                    ${() => {
                        if(comment.deleted){
                            return this.renderHtml`
                                <div class="${cssClasses.commentDeleted}">This comment has been deleted.</div>
                            `;
                        }
                        return this.renderView('_content', {
                            body: this.renderMarkdown(comment.body)
                        })
                    }}
                </div>
            </div>
        `;
    }
};
