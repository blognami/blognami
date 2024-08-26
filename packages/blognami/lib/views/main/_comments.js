
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

    .comment-main {
        flex: 1 1 0;
        border-style: solid;
        border-width: 0 0 0 2px;
        border-color: var(--color-light-gray);
        padding-left: 1em;
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
                    ${() => {
                        if(commentable.constructor.name == 'comment') return this.renderHtml`
                            <a class="${this.cssClasses.action}" href="/_actions/add_comment?commentableId=${commentable.id}" target="_overlay" data-test-id="add-comment">Reply</a>
                        `;
                        return this.renderView('_button', {
                            tagName: 'a',
                            isFullWidth: true,
                            href: `/_actions/add_comment?commentableId=${commentable.id}`,
                            target: '_overlay',
                            'data-test-id': 'add-comment',
                            body: 'Add comment',
                        });
                    }}
                </div>
            </div>
        `;
    }
}