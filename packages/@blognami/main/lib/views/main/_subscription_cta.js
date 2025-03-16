
export default {
    render(){
        const { access } = this.params;
        
        return this.renderHtml`
            <div>
                ${() => {
                    if (access == 'free') return this.renderHtml`
                        <p>This content is for subscribers only.</p>
                    `;
                    return this.renderHtml`
                        <p>This content is for paying subscribers only.</p>
                    `;
                }}
                <br>
                ${this.renderView(`_button`, {
                    tagName: 'a',
                    target: '_overlay',
                    isPrimary: true,
                    // TODO: get rid of inline script - replace with controller
                    body: this.renderHtml`
                        Subscribe now
                        <script type="pinstripe">
                            this.parent.patch({
                                ...this.parent.attributes,
                                href: '/_actions/guest/subscribe?returnUrl=' + encodeURIComponent(window.location.href)
                            })
                        </script>
                    `,
                })}
            </div>
        `;
    }
};
