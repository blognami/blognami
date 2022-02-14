
export default async ({ renderHtml, renderMarkdown, params: { pageable: post, isSignedIn }}) => {
    if(!post) return;
    
    if(!isSignedIn && !post.published) return renderHtml`
        <div class="content">
            <p>This post is not published yet.</p>
        </div>
    `;

    const tags = await post.tags.all();
    
    return renderHtml`
        <div class="content">
            <h1 class="title">${post.title}</h1>
            ${renderMarkdown(post.body)}
            ${() => {
                if(!tags.length) return;

                return renderHtml`
                    <hr>
                    <p>Tagged:</p>
                    <ul>
                        ${tags.map(({ name, slug }) => renderHtml`
                            <li><a href=${slug}>${name}</a></li>
                        `)}
                    </ul>
                `
            }}
        </div>
    `;
}