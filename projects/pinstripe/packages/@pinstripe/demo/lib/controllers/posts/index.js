
export default async ({ params, database, renderView }) => {
    const q = params.q || '';
    const page = parseInt(params.page || '1');
    const posts = await database.posts.titleContains(q).paginate(page).all;
    const pageCount = Math.ceil((await database.posts.titleContains(q).count) / 10);
    const pages = [];
    for(let currentPage = 1; currentPage <= pageCount; currentPage++){
        pages.push({
            number: currentPage,
            isCurrent: page == currentPage,
            url: `?${new URLSearchParams({q, page: currentPage})}`
        });
    }

    return renderView('posts/index', { q, posts, pages });
};
