
export default {
    meta(){
        this.addHook('render', async function(){
            const tenant = await this.database.tenant;
            if(!tenant || tenant.lifecycleStatus != 'paused') return;

            const path = this.params._url.pathname;

            // Allow subscription, auth, and session-related actions when paused
            if(path.match(/saas_|subscribe|stripe_webhook|sign_out|transfer_session|_subscription_options/)) return;

            return this.renderView('_403', {
                message: this.renderHtml`
                    This site is currently paused. Please subscribe to reactivate it.
                `
            });
        });
    }
}
