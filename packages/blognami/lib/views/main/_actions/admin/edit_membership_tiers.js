
export const styles = `
    .buttons {
        text-align: right;
        margin-bottom: 1em;
    }
`;

export default {
    render(){
        return this.renderHtml`
            <pinstripe-modal>
                ${this.renderView('_panel', {
                    title: 'Edit membership tiers',
                    body: this.renderHtml`
                        <div class="${this.cssClasses.buttons}">
                            ${this.renderTag('a', {
                                href: '/_actions/admin/add_membership_tier',
                                target: '_overlay',
                                body: 'Add tier',
                            })}
                        </div>
                        ${() => {
                            return this.renderHtml`
                                <p>No membership tiers have been added yet.</p>
                            `;
                        }}
                    `,
                    footer: this.renderView('_button', {
                        body: this.renderHtml`
                            Done
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