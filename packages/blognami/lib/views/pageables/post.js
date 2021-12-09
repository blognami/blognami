
export default ({ renderHtml, renderMarkdown, params: { pageable: post, isSignedIn }}) => {
    if(!post) return;
    
    if(!isSignedIn && !post.published) return renderHtml`
        <div class="content">
            <p>This post is not published yet.</p>
        </div>
    `;
    
    return renderHtml`
        <div class="content">
            <h1 class="title">${post.title}</h1>
            ${renderMarkdown(post.body)}
        </div>
    `;
}