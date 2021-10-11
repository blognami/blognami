
import { defineController } from 'pinstripe';

defineController('admin/guard', async ({ session, renderHtml, renderScript }) => {
    let user;
    if(await session){
        user = await session.user;
    }

    if(!user || user.role != 'admin'){
        const [ status, headers, body ] = await renderHtml`
            <div class="modal is-active">
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Access denied</p>
                        <button type="button" class="delete" aria-label="close"></button>
                    </header>
                    <section class="modal-card-body">
                        <p>You need to be an &quot;admin&quot; user to do this.</p>
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button">OK</button>
                    </footer>
                </div>
                ${renderScript(function(){
                    this.parent.on('click', '.modal-background, .modal-close, .delete, .modal-card-foot > button', () => {
                        this.frame.frame.load();
                    });
                })}
            </div>
        `.toResponseArray();

        return [403, headers, body];
    }
});
