
export default async ({ params: { posts }, renderHtml, renderView, formatDate }) => renderHtml`
    ${posts.all().map(({ slug, title, excerpt, excerptFromBody, readingMinutes, publishedAt, visibility } ) => renderHtml`
        <article class="bn-card">
            <a class="bn-card-link" href="/${slug}">
                <header class="bn-card-header">
                    <h2 class="bn-card-title">${title}</h2>
                </header>

                <div class="bn-card-excerpt">${excerpt || excerptFromBody}</div>

                <footer class="bn-card-meta">
                    <time class="bn-card-date" datetime="${formatDate(publishedAt, 'yyyy-MM-dd')}">${formatDate(publishedAt)}</time>
                    —
                    <span class="bn-card-meta-wrapper">
                        <span class="bn-card-duration">${readingMinutes} min read</span>

                        ${() => {
                            if(visibility == 'public') return renderView('partials/icons/_star');
                        }}
                    </span>
                </footer>
            </a>
        </article>
    `)}
`;