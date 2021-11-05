
export default async ({ session, renderView, renderHtml, database, params }) => {
    let user;
    if(await session){
        user = await session.user;
    }

    const page = parseInt(params.page || '1');
    const pageSize = 10;
    const postCount = await database.posts.count();
    const pageCount = Math.ceil(postCount / pageSize);
    const pagination = new Array(pageCount).fill().map((_,i) => {
        const number = i + 1;
        const current = number == page;
        return { number, current };
    });
    
    const posts = await database.posts.paginate(page, pageSize).all();

    const isSignedIn = user !== undefined;

    return renderView('_layout', {
        title: 'Blognami',
        isSignedIn,
        user,
        body: renderHtml`
            ${posts.map(({ slug, title, id, body }) => renderHtml`
                <div class="card mb-4">
                    <header class="card-header">
                        <a class="card-header-title" href="/${slug}">
                            ${title}
                        </a>
                        ${() => {
                            if(isSignedIn){
                                return renderHtml`
                                    <a
                                        class="delete"
                                        style="margin: 7px;"
                                        href="/admin/delete_post?id=${id}"
                                        target="_overlay"
                                        data-confirm="Are you really sure you want to delete this post?"
                                    ></a>
                                `;
                            }
                        }}
                    </header>
                    <div class="card-content">
                        <div class="content">
                            ${body}
                        </div>
                    </div>
                </div>
            `)}
            <nav class="pagination">
                <ul class="pagination-list mb-4">
                    ${pagination.map(({ number, current }) => renderHtml`
                        <li>
                            <a class="pagination-link${current ? ' is-current' : ''}" href="?page=${number}">${number}</a>
                        </li>
                    `)}
                </ul>
            </nav>
        `
    });
};
