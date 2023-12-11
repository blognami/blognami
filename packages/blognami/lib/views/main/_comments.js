
export const styles = `
    .comments {
        display: flex;
        flex-direction: column;
        gap: 3em;
    }

    .comments .comments {
        margin-top: 1em;
    }

    .comment {
        display: flex;
        gap: 1em;
        min-height: 150px;
    }

    .comment-avatar {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 0 0 auto;
    }

    .comment-avatar img {
        height: 2.5em;
        width: 2.5em;
        border-radius: 50%;
        border-style: solid;
        border-width: 2px;
        border-color: var(--color-light-gray);
    }

    .comment-avatar::after {
        content: ' ';
        background: var(--color-light-gray);
        width: 2px;
        height: 100%;
    }

    .comment-main {
        flex: 1 1 0;
    }
`;

export default {
    async render(){
        const { commentable, level = 0 } = this.params;

        let user;
        if(await this.session){
            user = await this.session.user;
        }

        return this.renderHtml`
            <div class="${this.cssClasses.comments}">
                ${commentable.comments.orderBy('createdAt').all().map(async comment => {
                    const commentUser = await comment.user;
    
                    return this.renderHtml`
                        <div class="${this.cssClasses.comment}">
                            <div class="${this.cssClasses.commentAvatar}">
                                <img src="data:image/svg+xml;utf8,${this.generateAvatar(commentUser.email)}">
                            </div>
                            <div class="${this.cssClasses.commentMain}">
                                <div class="${this.cssClasses.commentMeta}">
                                    <div>${commentUser.name}</div>
                                    <div data-test-id="comment-created-at">${this.formatDate(comment.createdAt, `LLL dd, yyyy 'at' hh:mm a`)}</div>
                                </div>
                                <div class="${this.cssClasses.commentBody}">
                                    ${() => {
                                        if(comment.deleted){
                                            return this.renderView('_content', {
                                                body: this.renderHtml`
                                                    <p>This comment has been deleted.</p>
                                                `
                                            })
                                        }
                                        return this.renderView('_content', {
                                            body: this.renderMarkdown(comment.body)
                                        })
                                    }}
                                </div>
                                ${() => {
                                    if(user?.id != commentUser.id && user?.role != 'admin') return;
                                    if(comment.deleted) return;
                                    return this.renderHtml`
                                        <div class="${this.cssClasses.commentActions}">
                                            <a 
                                                href="/_actions/user/edit_comment?id=${comment.id}"
                                                target="_overlay"
                                                data-test-id="edit-comment"
                                            >Edit</a>
                                            <a 
                                                href="/_actions/user/delete_comment?id=${comment.id}"
                                                target="_overlay"
                                                data-test-id="delete-comment"
                                                data-confirm="Are you really sure you want to delete this comment?"
                                            >Delete</a>
                                        </div>
                                    `;
                                }}
                                ${() => {
                                    if(level == 0) return this.renderView('_comments', { commentable: comment, level: level + 1  })
                                }}
                            </div>
                        </div>
                    `;
                })}
                <div class="${this.cssClasses.commentsFooter}">
                    <a href="/_actions/add_comment?commentableId=${commentable.id}" target="_overlay" data-test-id="add-comment">${commentable.constructor.name == 'comment' ? 'Reply' : 'Add comment'}</a>
                </div>
            </div>
        `;
    }
}