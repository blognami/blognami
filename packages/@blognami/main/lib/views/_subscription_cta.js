export const decorators = {
    button(){
        this.attributes.href = `${this.attributes.href}&returnUrl=${encodeURIComponent(window.location.href)}`;
    }
};

export default {
    async render(){
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
                    href: `/_actions/guest/subscribe?subscribableId=${await this.database.newsletter.id}`,
                    class: this.cssClasses.button,
                    body: 'Subscribe now',
                })}
            </div>
        `;
    }
};