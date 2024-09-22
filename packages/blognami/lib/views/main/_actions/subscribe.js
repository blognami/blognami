
export default {
    async render(){
        if(await this.session){
            this.user = await this.session.user;
        }

        if(!this.user){
            return this.renderHtml`
                <span data-component="pinstripe-anchor" data-href="/_actions/sign_in?title=${encodeURIComponent('Subscribe')}&redirectUrl=${encodeURIComponent(`/_actions/subscribe`)}">
                    <script type="pinstripe">
                        this.parent.trigger('click');
                    </script>
                </span>
            `;
        }

        return this.renderHtml`
            <pinstripe-modal>
                ${this.renderView('_panel', {
                    title: 'Choose a subscription plan',
                    body: this.renderView('_actions/_subscription_options', {
                        options: [
                            {
                                title: 'Monthly',
                                price: '$5',
                                description: 'Access to all premium content',
                                action: '/_actions/subscribe?plan=monthly'
                            },
                            {
                                title: 'Yearly',
                                price: '$50',
                                description: 'Access to all premium content',
                                action: '/_actions/subscribe?plan=yearly'
                            },
                            {
                                title: 'None',
                                price: '$0',
                                description: 'Access to all free content',
                                action: '/_actions/subscribe?plan=free'
                            }
                        ]
                    }),
                    footer: this.renderView('_button', {
                        body: this.renderHtml`
                            Cancel
                            <script type="pinstripe">
                                this.parent.on('click', () => this.trigger('close'));
                            </script>
                        `
                    })
                })}
            </pinstripe-modal>
        `;
    },
};
