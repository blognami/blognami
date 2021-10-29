
import { defineView } from 'pinstripe';

defineView('sign_out', async ({ session, renderScript }) => {

    if(await session){
        await session.delete();
    }

    const [ status, headers, body ] = await renderScript(() => this.document.load()).toResponseArray();

    headers['Set-Cookie'] = 'pinstripeSession=';

    return [ status, headers, body ];
});
