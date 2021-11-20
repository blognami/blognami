
export default async ({ session, renderHtml }) => {

    if(await session){
        await session.delete();
    }

    const [ status, headers, body ] = await renderHtml`
        <span data-action="load" data-target="_top"></span>
    `.toResponseArray();

    headers['Set-Cookie'] = 'pinstripeSession=';

    return [ status, headers, body ];
};
