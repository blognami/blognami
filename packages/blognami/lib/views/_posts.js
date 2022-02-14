
export default ({ params: { isSignedIn, posts }, renderList, renderHtml }) => renderList(posts, ({ row: { slug, title, id, body } }) => renderHtml`
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
`)