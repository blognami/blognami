
export default {
    async render(){
        let user;
        if(await this.session){
            user = await this.session.user;
        }
    
        if(!user || user.role != 'admin'){
            const [ status, headers, body ] = await this.renderHtml`
                <pinstripe-modal>
                    ${
                        this.renderView('_panel', {
                            title: 'Access denied',
                            body: this.renderHtml`
                                <p>You need to be an &quot;admin&quot; user to do this.</p>
                            `,
                            footer: this.renderView('_button', {
                                body: this.renderHtml`
                                    OK
                                    <script type="pinstripe">
                                        this.parent.on('click', () => this.trigger('close'));
                                    </script>
                                `
                            })
                        })
                    }
                </pinstripe-modal>
            `.toResponseArray();
    
            return [403, headers, body];
        }
    }
}