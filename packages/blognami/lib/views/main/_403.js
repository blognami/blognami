
export default {
    async render(){
        const { message } = this.params;

        const [ status, headers, body ] = await this.renderHtml`
            <pinstripe-modal>
                ${
                    this.renderView('_panel', {
                        title: 'Access denied',
                        body: this.renderHtml`
                            <p>${message}</p>
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