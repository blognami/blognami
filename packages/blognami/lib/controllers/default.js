
import { defineController } from 'pinstripe';

defineController('default', async ({ params: { _path: path }, pageables, session, renderView }) => {
    const slug = path.replace(/^\//, '');
    const pageable = await pageables.slugEq(slug).first();
    if(pageable) {
        let user;
        if(await session){
            user = await session.user;
        }

        const isSignedIn = user !== undefined;

        return renderView(`pageables/${pageable.constructor.name}`, {
            layout: true,
            title: pageable.title,
            pageable,
            isSignedIn,
            user
        });
    }
});
