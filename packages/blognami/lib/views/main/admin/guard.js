
export default async ({ session, renderHtml }) => {
    let user;
    if(await session){
        user = await session.user;
    }

    if(!user || user.role != 'admin'){
        const [ status, headers, body ] = await renderHtml`
            <div class="ps-modal" data-node-wrapper="anchor" data-target="_top" data-ignore-events-from-children="true">
                <button data-node-wrapper="anchor" data-target="_top"></button>
                <div class="ps-card">
                    <div class="ps-card-header">
                        <p class="ps-card-header-title">Access denied</p>
                    </div>
                    <div class="ps-card-body">
                        <p>You need to be an &quot;admin&quot; user to do this.</p>
                    </div>
                    <div class="ps-card-footer">
                        <button data-node-wrapper="anchor" data-target="_top">OK</button>
                    </div>
                </div>
            </div>
        `.toResponseArray();

        return [403, headers, body];
    }
};
