
export const styles = `
    .post + .post {
        margin-top: 8rem;
    }

    .post-link {
        display: block;
    }

    .post-link:hover {
        opacity: 1;
    }

    .post-title {
        font-size: 3.4rem;
        font-weight: 600;
    }

    .post-link:hover .post-title {
        opacity: 0.8;
    }

    .post-excerpt {
        margin-top: 1.2rem;
        font-size: 1.8rem;
        line-height: 1.5;
        letter-spacing: -0.01em;
    }

    .post-meta {
        margin-top: 2rem;
        font-size: 1.2rem;
        font-weight: 500;
        line-height: 1;
        color: var(--color-secondary-text);
        text-transform: uppercase;
    }

    .post-date {
        color: var(--accent-color);
    }

    .post-meta-wrapper {
        display: inline-flex;
        align-items: center;
    }

    .compact .post + .post {
        margin-top: 2.8rem;
    }

    .compact .post-title {
        font-size: 1.9rem;
        font-weight: 600;
        line-height: 1.25;
        letter-spacing: -0.01em;
    }

    .compact .post-excerpt {
        margin-top: 0.8rem;
        font-family: var(--font-sans);
        font-size: inherit;
        line-height: 1.55;
        color: var(--color-secondary-text);
        letter-spacing: 0;
    }

    .compact .post-meta {
        margin-top: 1.6rem;
    }

    .load-more-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 1.6rem;
        line-height: 1;
        cursor: pointer;
        padding: 1.4rem 1.6rem 1.4rem 1.6rem;
        border-radius: 6px;
        width: 100%;
        margin-top: 8rem;
        font-weight: 600;
        color: var(--color-black);
        letter-spacing: -0.02em;
        background-color: transparent;
        border: 1px solid var(--color-light-gray);
    }

    .load-more-button:hover {
        border-color: var(--color-mid-gray);
    }

    @media (max-width: 767px) {
        .post + .post {
            margin-top: 6.4rem;
        }

        .load-more-button {
            margin-top: 6.4rem;
        }
    }
`;

export default {
    async render(){
        const { posts, compact = false, loadMoreUrl } = this.params;

        return  this.renderHtml`
            <div class="${compact ? this.cssClasses.compact :  ''}">
                ${this.params.posts.all().map(({ slug, title, excerptFromBody, readingMinutes, publishedAt } ) => this.renderHtml`
                    <article class="${this.cssClasses.post}">
                        <a class="${this.cssClasses.postLink}" href="/${slug}" data-placeholder="/_placeholders/post">
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
                        </a>
                    </article>
                `)}
            </div>

            ${async () => {
                if(loadMoreUrl && await posts.all().length < await posts.count()) return this.renderHtml`
                    <button class="${this.cssClasses.loadMoreButton}" data-component="pinstripe-anchor" data-method="post" data-href="${loadMoreUrl}" data-test-id="load-more">Load more posts</button>
                `;
            }}
        `;
    }
};