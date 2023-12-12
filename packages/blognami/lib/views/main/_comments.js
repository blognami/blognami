
export const styles = `
    .comments {
        margin-top: 2em;
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

    .comment-meta {
        border-style: solid;
        border-width: 0 0 2px 0;
        border-color: var(--color-light-gray);
        padding-bottom: 1em;
    }

    .comment-name {
        font-weight: 500;
    }

    .comment-created-at {
        color: var(--color-gray);
        font-size: 12px;
        font-weight: 500;
    }

    .comment-body {
        padding-top: 2em;
    }

    .comment-actions {
        margin-top: 1em;
        display: flex;
        gap: 1em;
    }

    .action {
        font-size: 12px;
        font-weight: 500;
        color: var(--accent-color);
    }

    .avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 2.5em;
        width: 2.5em;
        border-radius: 50%;
        background: var(--color-light-gray);
        color: var(--color-gray);
        font-weight: 500;
        line-height: 0;
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

                    let initials = commentUser.name.trim().split(/\s+/).map(name => name[0]).join('');
                    if(initials.length > 2) initials = initials[0] + initials[initials.length - 1];
                    if(initials.length == 1) initials = initials + commentUser.name[1];

                    return this.renderHtml`
                        <div class="${this.cssClasses.comment}">
                            <div class="${this.cssClasses.commentAvatar}">
                                <div class="${this.cssClasses.avatar}">${initials}</div>
                            </div>
                            <div class="${this.cssClasses.commentMain}">
                                <div class="${this.cssClasses.commentMeta}">
                                    <div class="${this.cssClasses.commentName}">${commentUser.name}</div>
                                    <div class="${this.cssClasses.commentCreatedAt}" data-test-id="comment-created-at">${this.formatDate(comment.createdAt, `LLL dd, yyyy 'at' hh:mm a`)}</div>
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
                                                class="${this.cssClasses.action}"
                                                href="/_actions/user/edit_comment?id=${comment.id}"
                                                target="_overlay"
                                                data-test-id="edit-comment"
                                            >Edit</a>
                                            <a
                                                class="${this.cssClasses.action}"
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
                    <a class="${this.cssClasses.action}" href="/_actions/add_comment?commentableId=${commentable.id}" target="_overlay" data-test-id="add-comment">${commentable.constructor.name == 'comment' ? 'Reply' : 'Add comment'}</a>
                </div>
            </div>
        `;
    }
}