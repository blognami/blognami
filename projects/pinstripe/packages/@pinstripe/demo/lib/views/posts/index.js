
export default ({ renderView, html, params: { q, posts, pages } }) => renderView('layout', {
    title: 'Pinstripe JS - Posts',
    body: html`
        <section>
            <div class="container">
                <h1 class="title">Posts</h1>

                <button class="button is-primary is-pulled-right mb-4 p-anchor" data-url="/posts/add" data-target="_modal">Add Post</button>

                <form>
                    <input type="hidden" name="page" value="1">
                    <div class="control mb-4">
                        <input class="input" type="search" name="q" value="${q}" placeholder="Search...">
                    </div>
                </form>

                ${posts.map(post => html`
                    <div class="card mb-4">
                        <div class="card-header">
                            <a class="card-header-title" href="/posts/${post.id}">${post.title}</a>
                        </div>
                        <div class="card-content">
                            <p>${post.body}</p>
                        </div>
                    </div>
                `)}

                <nav class="pagination mb-4" role="navigation" aria-label="pagination">
                    <ul class="pagination-list">
                        ${pages.map(page => html`
                            <li>
                                <a class="pagination-link ${page.isCurrent ? 'is-current' : ''}" href="${page.url}">${page.number}</a>
                            </li>
                        `)}
                    </ul>
                </nav>
            </div>
        </section>
    `
});



