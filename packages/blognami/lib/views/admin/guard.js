
export default async ({ session, renderHtml }) => {
    let user;
    if(await session){
        user = await session.user;
    }

    if(!user || user.role != 'admin'){
        const [ status, headers, body ] = await renderHtml`
            <div class="ps-modal" data-node-wrapper="anchor" data-target="_top" data-ignore-events-from-children="true">
                <button data-node-wrapper="anchor" data-target="_top"></button>
                <div>
                    <header>
                        <p>Access denied</p>
                    </header>
                    <div>
                        <p>You need to be an &quot;admin&quot; user to do this.</p>
                    </div>
                    <footer>
                        <button data-node-wrapper="anchor" data-target="_top">OK</button>
                    </footer>
                </div>
            </div>
        `.toResponseArray();

        return [403, headers, body];
    }
};
