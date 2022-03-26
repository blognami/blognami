
export default async ({ params: { posts }, renderHtml, formatDate }) => renderHtml`
    ${posts.all().map(({ slug, title, excerptFromBody, readingMinutes, publishedAt } ) => renderHtml`
        <article class="bn-feed-item">
            <a class="bn-feed-item-link" href="/${slug}">
                <header class="bn-feed-item-header">
                    <h2 class="bn-feed-item-title">${title}</h2>
                </header>

                <div class="bn-feed-item-excerpt">${excerptFromBody}</div>

                <footer class="bn-feed-item-meta">
                    <time class="bn-feed-item-date" datetime="${formatDate(publishedAt, 'yyyy-MM-dd')}">${formatDate(publishedAt)}</time>
                    —
                    <span class="bn-feed-item-meta-wrapper">
                        <span class="bn-feed-item-duration">${readingMinutes} min read</span>
                    </span>
                </footer>
            </a>
        </article>
    `)}
`;