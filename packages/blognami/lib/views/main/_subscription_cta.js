
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
                    href: '/_actions/subscribe',
                    target: '_overlay',
                    isPrimary: true,
                    body: 'Subscribe now',
                })}
            </div>
        `;        
    }
};
