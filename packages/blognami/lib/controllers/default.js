
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

        return renderView('layout', {
            title: pageable.title,
            isSignedIn,
            user,
            body: renderView(`pageables/${pageable.constructor.name}`, { pageable, isSignedIn, user })
        });
    }
});
