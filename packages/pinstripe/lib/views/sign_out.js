
export default async ({ session, renderHtml }) => {

    if(await session){
        await session.delete();
    }

    const [ status, headers, body ] = await renderHtml`
        <span data-acts-as="a" data-target="_top" data-trigger="click"></span>
    `.toResponseArray();

    headers['Set-Cookie'] = 'pinstripeSession=';

    return [ status, headers, body ];
};
