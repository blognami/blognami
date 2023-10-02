
export default {
    async render(){
        const { commentable, level = 0 } = this.params;

        return this.renderHtml`
            <div class="comments">
                ${commentable.comments.orderBy('createdAt').all().map(async comment => {
                    const user = await comment.user;
    
                    return this.renderHtml`
                        <div class="comment">
                            <div class="comment-avatar">
                                <img src="data:image/svg+xml;utf8,${this.generateAvatar(user.email)}">
                            </div>
                            <div class="comment-main">
                                <div class="comment-meta">
                                    <div>${user?.name}</div>
                                    <div data-test-id="comment-created-at">${this.formatDate(comment.createdAt, `LLL dd, yyyy 'at' hh:mm a`)}</div>
                                </div>
                                <div class="comment-body content">${this.renderMarkdown(comment.body)}</div>
                                ${() => {
                                    if(level == 0) return this.renderView('_comments', { commentable: comment, level: level + 1  })
                                }}
                            </div>
                        </div>
                    `;
                })}
                <div class="comments-footer">
                    <a href="/add_comment?commentableId=${commentable.id}" target="_overlay" data-test-id="add-comment">${commentable.constructor.name == 'comment' ? 'Reply' : 'Add comment'}</a>
                </div>
            </div>
        `;
    }
}