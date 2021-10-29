
import { defineView } from 'pinstripe';

defineView('default', async ({ params: { _path: path }, pageables, session, renderView }) => {
    const slug = path.replace(/^\//, '');
    const pageable = await pageables.slugEq(slug).first();
    if(pageable) {
        let user;
        if(await session){
            user = await session.user;
        }

        const isSignedIn = user !== undefined;

        const body = await renderView(`pageables/${pageable.constructor.name}`, {
            isSignedIn,
            user,
            pageable,
        });

        if(Array.isArray(body)){
            return body;
        }

        return renderView('_layout', {
            isSignedIn,
            title: pageable.title,
            user,
            body
        });
    }
});
