

export const styles = `
    .root {
        width: 100%;
        border-collapse: collapse;
    }

    .search {
        display: flex;
        margin-bottom: 1em;
    }

    .search input {
        -moz-appearance: none;
        -webkit-appearance: none;
        align-items: center;
        border: 0.1rem solid transparent;
        border-radius: 0.4rem;
        box-shadow: inset 0 0.0625em 0.125em rgb(10 10 10 / 5%);
        display: inline-flex;
        font-size: 1.6rem;
        height: 2.5em;
        justify-content: flex-start;
        line-height: 1.5;
        padding-bottom: calc(0.5em - 0.1rem);
        padding-left: calc(0.75em - 0.1rem);
        padding-right: calc(0.75em - 0.1rem);
        padding-top: calc(0.5em - 0.1rem);
        position: relative;
        vertical-align: top;
        background-color: white;
        border-color: #dbdbdb;
        color: #363636;
        max-width: 100%;
        width: 100%;
    }

    .search input:focus {
        outline: none;
        border-color: #485fc7;
        box-shadow: 0 0 0 0.125em rgb(72 95 199 / 25%);
    }

    .heading-cell, .data-cell {
        font-weight: normal;
        padding: 1em;
        margin: 0;
        line-height: 0;
        border: 0.1rem solid #dbdbdb;
    }

    .heading-cell {
        font-weight: 600;
    }

    .pagination {
        text-align: right;
        margin-top: 7px;
    }
`;

export const decorators = {
    search(){
        this.on('input', event => {
            const url = new URL(this.frame.url);
            const search = new URLSearchParams(url.search);
            search.set('q', event.target.value);
            search.delete('page');
            url.search = search.toString();
            this.frame.load(url);
        });
    }
};

export default {
    render(){
        return this.renderHtml`
            <pinstripe-modal width="medium" height="full">
                ${this.renderView('_pinstripe/_panel', {
                    title: this.params.title,
                    body: this.renderHtml`
                        ${() => {
                            if(this.params.search) return this.renderHtml`
                                <div class="${this.cssClasses.search}">
                                    <input type="search" placeholder="Search" name="q" autocomplete="off" />
                                </div>
                            `;
                        }}
                        ${() => {
                            if(this.params.rows.length === 0) return this.renderHtml`
                                <p>No data found.</p>
                            `;
                            return this.renderHtml`
                                <table class="${this.cssClasses.root}">
                                    <thead>
                                        <tr>
                                            ${this.params.columns.map(column => this.renderHtml`
                                                <th class="${this.cssClasses.headingCell}">${column.title}</th>
                                            `)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${this.params.rows.map(row => this.renderHtml`
                                            <tr>
                                                ${this.params.columns.map(column => this.renderHtml`
                                                    <td class="${this.cssClasses.dataCell}">${column.cell(row)}</td>
                                                `)}
                                            </tr>
                                        `)}
                                    </tbody>
                                </table>
                                ${() => {
                                    if(this.params.pageCount > 1) return this.renderHtml`
                                        <div class="${this.cssClasses.pagination}">
                                            ${this.renderView('_pagination', {
                                                pageCount: this.params.pageCount,
                                                page: this.params.page,
                                                q: this.params.q,
                                            })}
                                        </div>
                                    `;
                                }}
                            `;
                        }}
                    `,
                    footer: this.renderView('_pinstripe/_button', {
                        body: this.renderHtml`
                            Close
                            <script type="pinstripe">
                                this.parent.on('click', () => this.trigger('close'));
                            </script>
                        `,
                    })
                })}
            </pinstripe-modal>
        `;
    }
};
