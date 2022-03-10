
export default async ({ renderHtml, session, params, database, renderView  }) => {
    if(!params.pageable) return;

    const tag = params.pageable;

    let user;
    if(await session){
        user = await session.user;
    }
    
    const isSignedIn = user !== undefined;
    let posts = database.posts.taggedWith(tag.name);
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
                <header class="bn-pagehead-content">
                    <div class="bn-tag-label">Topic</div>
    
                    <h1 class="bn-tag-name bn-pagehead-title">${tag.name}</h1>
    
                    <div class="bn-tag-description bn-pagehead-description">
                        ${() => {
                            if(tag.description) return renderHtml`
                                ${tag.description}
                            `;
                            return renderHtml`
                                A collection of ${postCount} ${postCount == 1 ? 'issue' : 'issues'}
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

// export default async ({ renderHtml, session, params, database, renderView }) => {
//     if(!params.pageable) return;

//     let user;
//     if(await session){
//         user = await session.user;
//     }

//     const isSignedIn = user !== undefined;
//     const page = parseInt(params.page || '1');
//     let posts = database.posts.taggedWith(params.pageable.name);
//     if(isSignedIn){
//         posts = posts.orderBy('published', 'asc')
//     } else {
//         posts = posts.publishedEq(true);
//     }
//     posts = posts.orderBy('publishedAt', 'desc').paginate(page, 10);

//     return renderHtml`
//         <div class="content">
//             <h1 class="title">${params.pageable.name}</h1>
//             ${renderView('_posts', { isSignedIn, posts })}
//         </div>
//     `;
// }