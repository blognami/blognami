
export default async ({ params, renderHtml, renderMarkdown, formatDate, renderView, pages, session }) => {
    const { page } = params;

    const pageUser = await page.user;

    let user;
    if(await session){
        user = await session.user;
    }

    const isSignedIn = user !== undefined;
    const isAdmin = isSignedIn && user.role == 'admin';

    return renderView('_layout', {
        title: page.title,
        body: renderHtml`
            <section class="bn-section">
                <article class="bn-article">
                    <header class="bn-article-header bn-canvas">
                        <span class="bn-article-meta">
                            By <a href="/${pageUser.slug}">${pageUser.name}</a>
                            —
                            <time datetime="${formatDate(page.publishedAt, 'yyyy-MM-dd')}">${formatDate(page.publishedAt)}</time>
                        </span>
                        
                        ${() => {
                            if(isAdmin) return renderHtml`
                                <div class="bn-editable-area">
                                    <div class="bn-editable-area-header">
                                        <a class="bn-editable-area-button" href="/admin/edit_page_title?id=${page.id}" target="_overlay">Edit</a>
                                    </div>
                                    <div class="bn-editable-area-body">
                                        <h1 class="bn-article-title">${page.title}</h1>
                                    </div>
                                </div>
                            `;
                            return renderHtml`
                                <h1 class="bn-article-title">${page.title}</h1>
                            `;
                        }}

                    </header>

                    <div class="bn-content bn-canvas">
                        ${() => {
                            if(isAdmin) return renderHtml`
                                <div class="bn-editable-area">
                                    <div class="bn-editable-area-header">
                                        <a class="bn-editable-area-button" href="/admin/edit_page_body?id=${page.id}" target="_overlay">Edit</a>
                                    </div>
                                    <div class="bn-editable-area-body bn-content bn-canvas">
                                        ${renderMarkdown(page.body)}
                                    </div>
                                </div>
                            `;
                            return renderMarkdown(page.body);
                        }}

                        ${() => {
                            if(isAdmin) return renderHtml`
                                <div class="bn-editable-area">
                                    <div class="bn-editable-area-header">
                                        <a class="bn-editable-area-button" href="/admin/edit_page_meta?id=${page.id}" target="_overlay">Edit</a>
                                    </div>
                                    <div class="bn-editable-area-body">
                                        <section class="bn-section">
                                            <h3 class="bn-section-title">Meta</h3>
                                            <p><b>Slug:</b> ${page.slug}</p>
                                            <p><b>Published:</b> ${page.published ? 'true' : 'false'}</p>
                                        </section>
                                    </div>
                                </div>

                                <section class="bn-section">
                                    <h3 class="bn-section-title">Danger area</h3>
                                    <p>
                                        <button
                                            class="ps-button is-primary"
                                            data-node-wrapper="anchor"
                                            data-method="post"
                                            data-href="/admin/delete_page?id=${page.id}"
                                            data-target="_overlay"
                                            data-confirm="Are you really sure you want to delete this page?"
                                        >Delete this Page</button>
                                    </p>
                                </section>
                            `;
                        }}
                        
                    </div>
                </article>
            </section>
        `
    });
};
