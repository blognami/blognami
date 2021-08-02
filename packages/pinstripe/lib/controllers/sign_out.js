
import { defineController } from 'pinstripe';

defineController('sign_out', async ({ session, renderHtml }) => {

    if(await session){
        await session.delete();
    }

    const [ status, headers, body ] = await renderHtml`
        ${() => this.document.load()}
    `.toResponseArray();

    headers['Set-Cookie'] = 'pinstripeSession=';

    return [ status, headers, body ];
});
