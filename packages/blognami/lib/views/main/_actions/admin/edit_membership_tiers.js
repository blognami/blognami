
export const styles = `
    .buttons {
        text-align: right;
        margin-bottom: 1em;
    }

    .table-wrapper {
        overflow-x: auto;
    }

    .table {
        width: 100%;
        border-spacing: 7px;
    }
    
    .table th, .table td {
        border: 1px solid #ccc;
        padding: 7px;
        min-width: 100px;
        white-space: nowrap;
    }
`;

export default {
    async render(){

        const membershipTiers = await this.database.membershipTiers.orderBy('monthlyPrice').all();

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
                            if(membershipTiers.length > 0) return this.renderHtml`
                                <div class="${this.cssClasses.tableWrapper}">
                                    <table class="${this.cssClasses.table}">
                                        <tbody>
                                            <tr>
                                                <th>&nbsp;</th>
                                                ${membershipTiers.map(({ name }) => this.renderHtml`
                                                    <th>${name}</th>
                                                `)}
                                            </tr>
                                            <tr>
                                                <th>Monthly price</th>
                                                ${membershipTiers.map(({ monthlyPrice }) => this.renderHtml`
                                                    <td>${monthlyPrice}</td>
                                                `)}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            `;
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