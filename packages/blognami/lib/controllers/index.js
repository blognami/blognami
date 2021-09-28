
import { defineController } from 'pinstripe';

defineController('index', async ({ session, renderView, database, params }) => {
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

    return renderView('index', {
        layout: true,
        title: 'Blognami',
        isSignedIn: user !== undefined,
        user,
        posts,
        pagination
    });
});