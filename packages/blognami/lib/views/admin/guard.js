
export default async ({ session, renderHtml }) => {
    let user;
    if(await session){
        user = await session.user;
    }

    if(!user || user.role != 'admin'){
        const [ status, headers, body ] = await renderHtml`
            <div class="modal is-active">
                <div class="modal-background" data-widget="trigger" data-event="click" data-action="load" data-target="_top"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Access denied</p>
                        <button type="button" class="delete" aria-label="close" data-widget="trigger" data-event="click" data-action="load" data-target="_top"></button>
                    </header>
                    <section class="modal-card-body">
                        <p>You need to be an &quot;admin&quot; user to do this.</p>
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button" data-widget="trigger" data-event="click" data-action="load"  data-target="_top">OK</button>
                    </footer>
                </div>
            </div>
        `.toResponseArray();

        return [403, headers, body];
    }
};
