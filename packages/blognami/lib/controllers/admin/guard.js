
import { defineController } from 'pinstripe';

defineController('admin/guard', async ({ session, renderHtml }) => {
    let user;
    if(await session){
        user = await session.user;
    }

    if(!user || user.role != 'admin'){
        const [ status, headers, body ] = await renderHtml`
            <div class="modal is-active">
                <div class="p-close modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Access denied</p>
                        <button type="button" class="p-close delete" aria-label="close"></button>
                    </header>
                    <section class="modal-card-body">
                        <p>You need to be an &quot;admin&quot; user to do this.</p>
                    </section>
                    <footer class="modal-card-foot">
                        <button class="p-close button">OK</button>
                    </footer>
                </div>
            </div>
        `.toResponseArray();

        return [403, headers, body];
    }
});
