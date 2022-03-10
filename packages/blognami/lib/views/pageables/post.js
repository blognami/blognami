
export default async ({ params, renderHtml, renderMarkdown, formatDate, renderView, posts }) => {
    if(!params.pageable) return;

    const post = params.pageable;

    const user = await post.user;

    const previousPost = await posts.idNe(post.id).publishedAtLt(post.publishedAt).orderBy('publishedAt', 'desc').first();
    const nextPost = await posts.idNe(post.id).publishedAtGt(post.publishedAt).orderBy('publishedAt', 'asc').first();

    return renderHtml`
        <main id="bn-main" class="bn-main">
            <article class="bn-article {{post_class}}">
                <header class="bn-article-header bn-canvas">
                    <span class="bn-article-meta">
                        By <a href="/${user.slug}">${user.name}</a>
                        
                        ${async () => {
                            if(await post.tags.count() > 0) return renderHtml`
                                in
                                ${post.tags.all().map(({ slug, name }, i) => renderHtml`${i > 0 ? ', ' : ''}<a class="bn-article-tag" href="/${slug}">${name}</a>`)}
                            `;
                        }}
                        —
                        <time datetime="${formatDate(post.publishedAt, 'yyyy-MM-dd')}">${formatDate(post.publishedAt)}</time>
                    </span>
        
                    <h1 class="bn-article-title">${post.title}</h1>

                    ${() => {
                        if(post.excerpt) return renderHtml`
                            <p class="bn-article-excerpt">${post.excerpt}</p>
                        `;
                    }}

                    ${() => {
                        if(post.featureImage) return renderHtml`
                            <figure class="bn-article-image">
                                <img
                                    srcset="{{img_url feature_image size="s"}} 300w,
                                            {{img_url feature_image size="m"}} 720w,
                                            {{img_url feature_image size="l"}} 960w,
                                            {{img_url feature_image size="xl"}} 1200w,
                                            {{img_url feature_image size="xxl"}} 2000w"
                                    sizes="(max-width: 1200px) 100vw, 1200px"
                                    src="{{img_url feature_image size="xl"}}"
                                    alt="{{#if feature_image_alt}}{{feature_image_alt}}{{else}}{{title}}{{/if}}"
                                >
                                {{#if feature_image_caption}}
                                    <figcaption>{{feature_image_caption}}</figcaption>
                                {{/if}}
                            </figure>
                        `;
                    }}
                </header>
        
                <div class="bn-content bn-canvas">
                    ${renderMarkdown(post.body)}
                </div>
        
                <footer class="bn-article-footer bn-canvas">
                    <nav class="bn-navigation">
                        <div class="bn-navigation-previous">
                            ${() => {
                                if(previousPost) return renderHtml`
                                    <a class="bn-navigation-link" href="/${previousPost.slug}">
                                        <span class="bn-navigation-label">${renderView('partials/icons/_arrow-left')} Previous issue</span>
                                        <h4 class="bn-navigation-title">${previousPost.title}</h4>
                                    </a>
                                `;
                            }}
                        </div>
    
                        <div class="bn-navigation-middle"></div>
    
                        <div class="bn-navigation-next">
                            ${() => {
                                if(nextPost) return renderHtml`
                                    <a class="bn-navigation-link" href="/${nextPost.slug}">
                                        <span class="bn-navigation-label">Next issue ${renderView('partials/icons/_arrow-right')}</span>
                                        <h4 class="bn-navigation-title">${nextPost.title}</h4>
                                    </a>
                                `;
                            }}
                        </div>
                    </nav>
                </footer>
            </article>
        </main>
    `
};


// export default async ({ renderHtml, renderMarkdown, params: { pageable: post, isSignedIn }}) => {
//     if(!post) return;
    
//     if(!isSignedIn && !post.published) return renderHtml`
//         <div class="content">
//             <p>This post is not published yet.</p>
//         </div>
//     `;

//     const tags = await post.tags.all();
    
//     return renderHtml`
//         <div class="content">
//             <h1 class="title">${post.title}</h1>
//             ${renderMarkdown(post.body)}
//             ${() => {
//                 if(!tags.length) return;

//                 return renderHtml`
//                     <hr>
//                     <p>Tagged:</p>
//                     <ul>
//                         ${tags.map(({ name, slug }) => renderHtml`
//                             <li><a href=${slug}>${name}</a></li>
//                         `)}
//                     </ul>
//                 `
//             }}
//         </div>
//     `;
// }