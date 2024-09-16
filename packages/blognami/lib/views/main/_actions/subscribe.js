
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
            <p>Coming soon!</p>
        `;
    },
};
