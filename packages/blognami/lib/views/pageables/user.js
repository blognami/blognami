
export default async ({ params, session, renderHtml, renderView }) => {
    if(!params.pageable) return;

    const user = params.pageable;
    
    let sessionUser;
    if(await session){
        sessionUser = await session.user;
    }
    
    const isSignedIn = sessionUser !== undefined;
    let posts = user.posts;
    if(isSignedIn){
        posts = posts.orderBy('published', 'asc')
    } else {
        posts = posts.publishedEq(true);
    }
    posts = posts.orderBy('publishedAt', 'desc');

    const pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
    
    posts = posts.paginate(1, pageSize);

    const postCount = await posts.count();

    return renderHtml`
        <main id="bn-main" class="bn-main bn-canvas">
            <section class="bn-pagehead">
                ${() => {
                    if(user.profileImage) return renderHtml`
                        <img class="bn-author-image bn-pagehead-image" src="/${user.profileImage.slug}" alt="${user.name}">
                    `;
                    return renderHtml`
                        <span class="bn-author-icon">${renderView('partials/icons/_avatar')}</span>
                    `;
                }}
    
                <header class="bn-pagehead-content">
                    <h1 class="bn-author-name bn-pagehead-title">${user.name}</h1>

                    ${() => {
                        if(user.bio) return renderHtml`
                            <div class="bn-author-bio bn-pagehead-description">${user.bio}</div>
                        `;
                    }}
    
                    <div class="bn-author-meta">
                        ${() => {
                            if(user.location) return renderHtml`
                                <span class="bn-author-location">📍 ${user.location}</span>
                            `;
                        }}
                        ${() => {
                            if(user.website) return renderHtml`
                                <a class="bn-author-website" href="${user.website}" target="_blank" rel="noopener">${user.website}</a>
                            `;
                        }}
                    </div>
                </header>
            </section>
        
            <div class="bn-feed">
                ${renderView('_posts', { posts })}
            </div>

            ${async () => {
                if(await posts.all().length < await posts.count()) return renderHtml`
                    <button class="bn-loadmore bn-btn" data-node-wrapper="anchor" data-method="post" data-href="?pageSize=${pageSize + 10}">Load more issues</button>
                `;
            }}
        </main>
    `;
};
