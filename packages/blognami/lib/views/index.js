
export default async ({ session, site, params, database, renderView, renderHtml, formatDate }) => {
    let user;
    if(await session){
        user = await session.user;
    }

    const isSignedIn = user !== undefined;
    const isMember = isSignedIn && (user.role == 'member' || user.role == 'paid-member');
    const isPaidMember = isSignedIn && user.role == 'paid-member';
    
    let posts = database.posts;
    if(isSignedIn){
        posts = posts.orderBy('published', 'asc')
    } else {
        posts = posts.publishedEq(true);
    }

    posts = posts.orderBy('publishedAt', 'desc');

    const featuredPosts = posts.featuredEq(true);

    const firstPost = await posts.first();
    
    const pageSize = params.pageSize ? parseInt(params.pageSize) : 10;
    posts = posts.paginate(1, pageSize).skip(1);

    const tags = database.posts.tags.orderBy('name');

    return renderView('_layout', {
        body: renderHtml`
            <main id="bn-main" class="bn-main bn-outer">
                <div class="bn-inner">
                    ${() => {
                        if(firstPost) return renderHtml`
                            <article class="bn-latest bn-card">
                                <a class="bn-card-link" href="/${firstPost.slug}">
                                    <header class="bn-card-header">
                                        <div class="bn-article-meta">
                                            <span class="bn-card-date">Latest — <time datetime="${formatDate(firstPost.publishedAt, 'yyyy-MM-dd')}">${formatDate(firstPost.publishedAt)}</time></span>
                                        </div>

                                        <h2 class="bn-article-title bn-card-title">${firstPost.title}</h2>
                                    </header>

                                    <p class="bn-article-excerpt">${firstPost.excerpt || firstPost.excerptFromBody}</p>

                                    <footer class="bn-card-meta">
                                        <span class="bn-card-meta-wrapper">
                                            <span class="bn-card-duration">${firstPost.readingMinutes} min read</span>
                                            
                                            ${() => {
                                                if(firstPost.visibility == 'public') return renderView('partials/icons/_star');
                                            }}
                                        </span>
                                    </footer>
                                </a>
                            </article>
                        `;
                    }}
                    <div class="bn-wrapper">
                        <section class="bn-section">
                            <h2 class="bn-section-title">More issues</h2>
            
                            <div class="bn-feed">
                                ${renderView('_posts', { posts })}
                            </div>

                            ${async () => {
                                if(await posts.count() == 0) return renderHtml`
                                    Additional issues will be published soon.
                                `;
                            }}

                            ${async () => {
                                if(await posts.all().length < await posts.count()) return renderHtml`
                                    <button class="bn-loadmore bn-btn" data-node-wrapper="anchor" data-method="post" data-href="/?pageSize=${pageSize + 10}">Load more issues</button>
                                `;
                            }}
                        </section>
            
                        <aside class="bn-sidebar">
                            <section class="bn-section">
                                <h2 class="bn-section-title">About</h2>
            
                                <div class="bn-about">
                                    ${async () => {
                                        if(await site.icon) return renderHtml`
                                            <img class="bn-about-icon" src="{{@site.icon}}" alt="{{@site.title}}">
                                        `;
                                    }}
                                    <section class="bn-about-wrapper">
                                        <h3 class="bn-about-title">${site.title}</h3>

                                        ${async () => {
                                            if(await site.description) return renderHtml`
                                                <p class="bn-about-description">${site.description}</p>
                                            `;
                                        }}
                                    </section>
                                </div>

                                ${() => {
                                    if(!isPaidMember) return renderHtml`
                                        <div class="bn-signup">
                                            ${() => {
                                                if(!isMember){
                                                    return renderHtml`
                                                        <p class="bn-signup-description">Sign up now to get access to the library of members-only issues.</p>
                        
                                                        <a class="bn-subscribe-input" href="/sign_up">
                                                            <div class="bn-subscribe-input-text">
                                                                ${renderView('partials/icons/_email')}
                                                                jamie@example.com
                                                            </div>
                                                            <div class="bn-subscribe-input-btn">Subscribe</div>
                                                        </a>
                                                    `
                                                }
                                                return renderHtml`
                                                    <p class="bn-signup-description">Upgrade to a paid account to get full access.</p>
                                                    <a class="bn-signup-btn bn-btn bn-primary-btn" href="/upgrade_account">Upgrade now</a>
                                                `

                                            }}
                                        </div>
                                    `
                                }}
                            </section>
            
                            ${async () => {
                                if(await featuredPosts.count() > 0) return renderHtml`
                                    <section class="bn-section">
                                        <h3 class="bn-section-title">Featured</h3>
                                        <div class="bn-featured bn-feed">
                                            ${renderView('_posts', { posts: featuredPosts })}
                                        </div>
                                    </section>
                                `;
                            }}

                            ${async () => {
                                if(await tags.count() > 0) return renderHtml`
                                    <section class="bn-section">
                                        <h3 class="bn-section-title">Topics</h3>
                
                                        <div class="bn-topic">
                                            ${tags.all().map(({ name, slug }) => renderHtml`
                                                <a class="bn-topic-item" href="/${slug}">
                                                    <h3 class="bn-topic-name">${name}</h3>
                                                    <span class="bn-topic-count">
                                                        ${async () => {
                                                            const count = await database.posts.taggedWith(name).count();
                                                            if(count == 1) return renderHtml`
                                                                ${count} issue
                                                            `;

                                                            return renderHtml`
                                                                ${count} issues
                                                            `;
                                                        }}
                                                    </span>
                                                </a>
                                            `)}
                                        </div>
                                    </section>
                                `;
                            }}
                        </aside>
                    </div>
                </div>
            </main>
        `
    });
};




// export default async ({ session, renderView, database, params }) => {
//     let user;
//     if(await session){
//         user = await session.user;
//     }

//     const isSignedIn = user !== undefined;
//     const page = parseInt(params.page || '1');
//     let posts = database.posts;
//     if(isSignedIn){
//         posts = posts.orderBy('published', 'asc')
//     } else {
//         posts = posts.publishedEq(true);
//     }
//     posts = posts.orderBy('publishedAt', 'desc').paginate(page, 10);
    
    
//     return renderView('_layout', {
//         title: 'Blognami',
//         isSignedIn,
//         user,
//         body: renderView('_posts', { isSignedIn, posts })
//     });
// };
