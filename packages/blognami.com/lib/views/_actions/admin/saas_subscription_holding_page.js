export default {
    async render(){
        const { action, returnUrl, tenantId, plan, interval } = this.params;

        if(action === 'poll'){
            while(true){
                const tenant = await this.runInNewWorkspace(async _ => _.database.tenant);
                if(tenant?.subscriptionPlan === plan && tenant?.subscriptionInterval === interval) break;
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            return this.renderRedirect({ url: returnUrl, target: '_parent' });
        }

        return this.renderView('_layout', {
            body: this.renderRedirect({
                url: `/_actions/admin/saas_subscription_holding_page?action=poll&tenantId=${encodeURIComponent(tenantId)}&plan=${encodeURIComponent(plan)}&interval=${encodeURIComponent(interval)}&returnUrl=${encodeURIComponent(returnUrl)}`,
                method: 'post',
                target: '_overlay',
                placeholder: '/_placeholders/overlay'
            })
        });
    }
};
