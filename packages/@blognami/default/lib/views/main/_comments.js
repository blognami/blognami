
export default {
    styles: `
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
    `,

    async render(){
        const { commentable, level = 0 } = this.params;

        return this.renderHtml`
            <div class="${this.cssClasses.comments}">
                ${commentable.comments.orderBy('createdAt').all().map(async comment => {
                    const user = await comment.user;
    
                    return this.renderHtml`
                        <div class="${this.cssClasses.comment}">
                            <div class="${this.cssClasses.commentAvatar}">
                                <img src="data:image/svg+xml;utf8,${this.generateAvatar(user.email)}">
                            </div>
                            <div class="${this.cssClasses.commentMain}">
                                <div class="${this.cssClasses.commentMeta}">
                                    <div>${user?.name}</div>
                                    <div data-test-id="comment-created-at">${this.formatDate(comment.createdAt, `LLL dd, yyyy 'at' hh:mm a`)}</div>
                                </div>
                                <div class="${this.cssClasses.commentBody}">
                                    ${this.renderView('_content', {
                                        body: this.renderMarkdown(comment.body)
                                    })}
                                </div>
                                ${() => {
                                    if(level == 0) return this.renderView('_comments', { commentable: comment, level: level + 1  })
                                }}
                            </div>
                        </div>
                    `;
                })}
                <div class="${this.cssClasses.commentsFooter}">
                    <a href="/add_comment?commentableId=${commentable.id}" target="_overlay" data-test-id="add-comment">${commentable.constructor.name == 'comment' ? 'Reply' : 'Add comment'}</a>
                </div>
            </div>
        `;
    }
}