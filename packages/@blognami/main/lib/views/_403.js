
export default {
    async render(){
        const { message } = this.params;

        const [ status, headers, body ] = await this.renderHtml`
            <blognami-modal>
                ${
                    this.renderView('_panel', {
                        title: 'Access denied',
                        body: this.renderHtml`
                            <p>${message}</p>
                        `,
                        footer: this.renderView('_button', {
                            body: this.renderHtml`
                                OK
                                <script type="blognami">
                                    this.parent.on('click', () => this.trigger('close'));
                                </script>
                            `
                        })
                    })
                }
            </blognami-modal>
        `.toResponseArray();

        return [403, headers, body];
    }
}