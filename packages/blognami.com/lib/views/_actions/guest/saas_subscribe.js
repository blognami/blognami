
export default {
    render(){
        return this.renderHtml`
            <pinstripe-modal>
                ${this.renderView('_panel', {
                    title: 'Coming soon',
                    body: this.renderHtml`
                        <p>We are working on this feature. Please check back later.</p>
                    `,
                    footer: this.renderView('_button', {
                        body: this.renderHtml`
                            OK
                            <script type="pinstripe">
                                this.parent.on('click', () => this.trigger('close'));
                            </script>
                        `
                    })
                })}
            </pinstripe-modal>
        `;
    }
};
