const MAX_COMMENT_DEPTH = 8;
const NARROW_MAX_COMMENT_DEPTH = 4;
const COMMENT_BATCH_SIZE = 20;

const RELATIVE_TIME_UNITS = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
];

const formatRelativeDate = date => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    for(const [unit, unitInSeconds] of RELATIVE_TIME_UNITS){
        const count = Math.floor(seconds / unitInSeconds);
        if(count > 0) return `${count} ${unit}${count == 1 ? '' : 's'} ago`;
    }
    return 'just now';
};

export const styles = ({ colors, remify, breakpointFor }) => `
    .comments {
        margin-top: 2em;
        display: flex;
        flex-direction: column;
        gap: 1.5em;
    }

    .comments .comments {
        margin-top: 0.75em;
        gap: 1em;
        padding-left: 1em;
        border-left: ${remify(2)} solid ${colors.gray[200]};
    }

    .comment-meta {
        display: flex;
        align-items: baseline;
        gap: 0.5em;
    }

    .comment-name {
        font-size: ${remify(13)};
        font-weight: 600;
        color: ${colors.gray[900]};
    }

    .comment-created-at {
        font-size: ${remify(12)};
        color: ${colors.gray[500]};
    }

    .comment-created-at::before {
        content: '·';
        margin-right: 0.5em;
    }

    .comment-body {
        margin-top: 0.5em;
        font-size: ${remify(15)};
    }

    .comment .comment-body > * {
        margin-top: 0;
    }

    .comment .comment-body p {
        margin: 0 0 0.75em 0;
        font-size: ${remify(15)};
        line-height: 1.6;
    }

    .comment .comment-body p:last-child {
        margin-bottom: 0;
    }

    .comment-deleted {
        font-size: ${remify(14)};
        font-style: italic;
        color: ${colors.gray[400]};
    }

    .comment-actions {
        margin-top: 0.5em;
        display: flex;
        gap: 1em;
    }

    .action {
        font-size: ${remify(12)};
        font-weight: 600;
        color: ${colors.gray[500]};
        text-decoration: none;
    }

    .action:hover {
        color: ${colors.semantic.accent};
    }

    .collapse-toggle {
        border: none;
        background: none;
        padding: 0;
        cursor: pointer;
        font-family: inherit;
        font-size: ${remify(12)};
        font-weight: 600;
        color: ${colors.gray[400]};
    }

    .collapse-toggle:hover {
        color: ${colors.semantic.accent};
    }

    .expand-label {
        display: none;
    }

    .collapse-summary {
        display: none;
        font-size: ${remify(12)};
        font-weight: 400;
        color: ${colors.gray[500]};
    }

    .comment[data-collapsed="true"] > .comment-main > .comment-meta .collapse-label {
        display: none;
    }

    .comment[data-collapsed="true"] > .comment-main > .comment-meta .expand-label {
        display: inline;
    }

    .comment[data-collapsed="true"] > .comment-main > .comment-meta .collapse-summary {
        display: inline;
    }

    .comment[data-collapsed="true"] > .comment-main > .comment-meta > .comment-created-at,
    .comment[data-collapsed="true"] > .comment-main > .comment-body,
    .comment[data-collapsed="true"] > .comment-main > .comment-actions,
    .comment[data-collapsed="true"] > .comment-main > .comments,
    .comment[data-collapsed="true"] > .comment-main > .deep-comments,
    .comment[data-collapsed="true"] > .comment-main > .continue-thread {
        display: none;
    }

    .continue-thread {
        display: inline-block;
        margin-top: 0.75em;
        color: ${colors.semantic.accent};
    }

    .deep-comments {
        display: none;
    }

    ${breakpointFor('md')} {
        .deep-comments {
            display: block;
        }

        .continue-thread-narrow {
            display: none;
        }
    }
`;

export const decorators = {
    collapseToggle(){
        this.on('click', () => {
            const comment = this.parents.find(node => node.is('[data-collapsed]'));
            comment.attributes['data-collapsed'] = comment.attributes['data-collapsed'] == 'true' ? 'false' : 'true';
        });
    }
};

export default {
    async render(){
        const { commentable, level = 0 } = this.params;
        const pageSize = this.params.pageSize ? parseInt(this.params.pageSize) : COMMENT_BATCH_SIZE;

        let user;
        if(await this.session){
            user = await this.session.user;
        }

        const totalCommentCount = await commentable.comments.count();
        const comments = await commentable.comments.orderBy('createdAt').orderBy('id').paginate(1, pageSize).all();

        const rootCommentable = await commentable.rootCommentable;
        const rootUrl = `/${rootCommentable.slug}`;
        const loadMoreUrl = `${rootUrl}?${commentable.constructor.name == 'comment' ? `commentId=${commentable.id}&` : ''}commentPageSize=${pageSize + COMMENT_BATCH_SIZE}`;

        const childrenByCommentId = {};
        let parents = comments;
        for(let depth = level + 1; parents.length > 0 && depth <= MAX_COMMENT_DEPTH; depth++){
            const children = await this.database.comments.where({ commentableId: parents.map(comment => comment.id) }).orderBy('createdAt').all();
            children.forEach(child => {
                if(!childrenByCommentId[child.commentableId]) childrenByCommentId[child.commentableId] = [];
                childrenByCommentId[child.commentableId].push(child);
            });
            parents = children;
        }

        const countReplies = comment => {
            const children = childrenByCommentId[comment.id] || [];
            return children.reduce((count, child) => count + countReplies(child), children.length);
        };

        const renderComment = async (comment, level) => {
            const commentUser = await comment.user;
            const children = childrenByCommentId[comment.id] || [];
            const replyCount = countReplies(comment);

            return this.renderHtml`
                <div class="${this.cssClasses.comment}" data-test-id="comment" data-collapsed="false">
                    <div class="${this.cssClasses.commentMain}">
                        <div class="${this.cssClasses.commentMeta}">
                            <div class="${this.cssClasses.commentName}">
                                ${() => {
                                    if(children.length == 0) return;
                                    return this.renderHtml`
                                        <button
                                            type="button"
                                            class="${this.cssClasses.collapseToggle}"
                                            data-test-id="collapse-comment"
                                        ><span class="${this.cssClasses.collapseLabel}">[−]</span><span class="${this.cssClasses.expandLabel}">[+]</span></button>
                                    `;
                                }}
                                ${commentUser.name}
                                ${() => {
                                    if(children.length == 0) return;
                                    return this.renderHtml`
                                        <span class="${this.cssClasses.collapseSummary}" data-test-id="collapse-summary">${replyCount} ${replyCount == 1 ? 'reply' : 'replies'}</span>
                                    `;
                                }}
                            </div>
                            <div class="${this.cssClasses.commentCreatedAt}" data-test-id="comment-created-at" title="${this.formatDate(comment.createdAt, `LLL dd, yyyy 'at' hh:mm a`)}">${formatRelativeDate(comment.createdAt)}</div>
                        </div>
                        <div class="${this.cssClasses.commentBody}">
                            ${() => {
                                if(comment.deleted){
                                    return this.renderHtml`
                                        <div class="${this.cssClasses.commentDeleted}">This comment has been deleted.</div>
                                    `;
                                }
                                return this.renderView('_content', {
                                    body: this.renderMarkdown(comment.body)
                                })
                            }}
                        </div>
                        <div class="${this.cssClasses.commentActions}">
                            ${() => {
                                if(user?.id != commentUser.id && user?.role != 'admin') return;
                                if(comment.deleted) return;
                                return this.renderHtml`
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
                                `;
                            }}
                            <a
                                class="${this.cssClasses.action}"
                                href="/_actions/user/add_comment?commentableId=${comment.id}"
                                target="_overlay"
                                data-test-id="add-comment"
                            >Reply</a>
                        </div>
                        ${() => {
                            if(children.length == 0) return;
                            if(level + 1 >= MAX_COMMENT_DEPTH) return this.renderHtml`
                                <a
                                    class="${this.cssClasses.action} ${this.cssClasses.continueThread}"
                                    href="${rootUrl}?commentId=${comment.id}"
                                    data-test-id="continue-thread"
                                >Continue this thread →</a>
                            `;
                            if(level + 1 == NARROW_MAX_COMMENT_DEPTH) return this.renderHtml`
                                <div class="${this.cssClasses.deepComments}">${renderComments(children, level + 1)}</div>
                                <a
                                    class="${this.cssClasses.action} ${this.cssClasses.continueThread} ${this.cssClasses.continueThreadNarrow}"
                                    href="${rootUrl}?commentId=${comment.id}"
                                    data-test-id="continue-thread-narrow"
                                >Continue this thread →</a>
                            `;
                            return renderComments(children, level + 1);
                        }}
                    </div>
                </div>
            `;
        };

        const renderComments = (comments, level) => this.renderHtml`
            <div class="${this.cssClasses.comments}">
                ${comments.map(comment => renderComment(comment, level))}
            </div>
        `;

        return this.renderHtml`
            <div class="${this.cssClasses.comments}">
                ${() => {
                    if(commentable.constructor.name == 'comment') return this.renderHtml`
                        <a class="${this.cssClasses.action}" href="${rootUrl}" data-test-id="back-to-discussion">← Back to full discussion</a>
                    `;
                }}
                ${comments.map(comment => renderComment(comment, level))}
                ${() => {
                    if(comments.length < totalCommentCount) return this.renderView('_button', {
                        tagName: 'a',
                        isFullWidth: true,
                        href: loadMoreUrl,
                        'data-method': 'post',
                        'data-test-id': 'load-more',
                        body: 'Load more comments',
                    });
                }}
                <div class="${this.cssClasses.commentsFooter}">
                    ${() => {
                        if(commentable.constructor.name == 'comment') return this.renderHtml`
                            <a class="${this.cssClasses.action}" href="/_actions/user/add_comment?commentableId=${commentable.id}" target="_overlay" data-test-id="add-comment">Reply</a>
                        `;
                        return this.renderView('_button', {
                            tagName: 'a',
                            isFullWidth: true,
                            href: `/_actions/user/add_comment?commentableId=${commentable.id}`,
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
