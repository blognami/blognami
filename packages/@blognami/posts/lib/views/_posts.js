
export const styles = ({ colors, fonts, breakpointFor, remify }) => `
    .post + .post {
        margin-top: ${remify(64)};
    }

    .post-link {
        display: flex;
        gap: ${remify(24)};
    }

    .post-text {
        flex: 1;
        min-width: 0;
    }

    .post-thumbnail {
        flex-shrink: 0;
        width: ${remify(64)};
        height: ${remify(64)};
        object-fit: cover;
    }

    .post-link:hover {
        opacity: 1;
    }

    .post-title {
        font-size: ${remify(34)};
        font-weight: 600;
    }

    .post-link:hover .post-title {
        opacity: 0.8;
    }

    .post-excerpt {
        margin-top: ${remify(12)};
        font-size: ${remify(18)};
        line-height: 1.5;
        letter-spacing: -0.01em;
    }

    .post-meta {
        margin-top: ${remify(20)};
        font-size: ${remify(12)};
        font-weight: 500;
        line-height: 1;
        color: ${colors.semantic.secondaryText};
        text-transform: uppercase;
    }

    .post-date {
        color: ${colors.semantic.accent};
    }

    .post-meta-wrapper {
        display: inline-flex;
        align-items: center;
    }

    .compact .post + .post {
        margin-top: ${remify(28)};
    }

    .compact .post-title {
        font-size: ${remify(19)};
        font-weight: 600;
        line-height: 1.25;
        letter-spacing: -0.01em;
    }

    .compact .post-excerpt {
        margin-top: ${remify(8)};
        font-family: ${fonts.sans};
        font-size: inherit;
        line-height: 1.55;
        color: ${colors.semantic.secondaryText};
        letter-spacing: 0;
    }

    .compact .post-meta {
        margin-top: ${remify(16)};
    }

    ${breakpointFor('md')} {
        .post + .post {
            margin-top: ${remify(80)};
        }

        .post-thumbnail {
            width: ${remify(84)};
            height: ${remify(84)};
        }
    }
`;

export default {
    async render(){
        const { posts, compact = false, loadMoreUrl } = this.params;

        const allPosts = await posts.all();
        const featuredImageIds = allPosts.map(post => post.featuredImageId).filter(id => id);
        const images = featuredImageIds.length > 0
            ? await this.database.images.where({ id: featuredImageIds }).all()
            : [];
        const imageById = new Map(images.map(image => [image.id, image]));

        return  this.renderHtml`
            <div class="${compact ? this.cssClasses.compact :  ''}">
                ${allPosts.map(({ slug, title, excerptFromBody, readingMinutes, publishedAt, featuredImageId } ) => this.renderHtml`
                    <article class="${this.cssClasses.post}">
                        <a class="${this.cssClasses.postLink}" href="/${slug}">
                            <div class="${this.cssClasses.postText}">
                                <header class="${this.cssClasses.postHeader}">
                                    <h2 class="${this.cssClasses.postTitle}">${title}</h2>
                                </header>
            
                                <div class="${this.cssClasses.postExcerpt}">${excerptFromBody}</div>
            
                                <footer class="${this.cssClasses.postMeta}">
                                    ${() => {
                                        if(publishedAt) return this.renderHtml`
                                            <time class="${this.cssClasses.postDate}" datetime="${this.formatDate(publishedAt, 'yyyy-MM-dd')}" data-test-id="post-published-at">${this.formatDate(publishedAt)}</time>
                                            —
                                        `;
                                    }}
                                
                                    <span class="${this.cssClasses.postMetaWrapper}">
                                        <span class="${this.cssClasses.postDuration}">${readingMinutes} min read</span>
                                    </span>
                                </footer>
                            </div>

                            ${() => {
                                const image = imageById.get(featuredImageId);
                                if(image) return this.renderHtml`<img class="${this.cssClasses.postThumbnail}" src="/${image.slug}" alt="" data-test-id="post-thumbnail">`;
                            }}
                        </a>
                    </article>
                `)}
            </div>

            ${async () => {
                if(loadMoreUrl && await posts.all().length < await posts.withoutPagination().count()) return this.renderView('_button', {
                    tagName: 'a',
                    isFullWidth: true,
                    href: loadMoreUrl,
                    'data-method': 'post',
                    'data-test-id': 'load-more',
                    style: 'font-weight: 600;',
                    body: 'Load more posts',
                });
            }}
        `;
    }
};