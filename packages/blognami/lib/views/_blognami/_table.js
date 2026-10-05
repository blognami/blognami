

export const styles = ({ remify }) => `
    .root {
        width: 100%;
        border-collapse: collapse;
    }

    .toolbar {
        display: flex;
        gap: ${remify(8)};
        align-items: center;
        margin-bottom: 1em;
    }

    .search {
        display: flex;
        flex: 1;
    }

    .search input {
        -moz-appearance: none;
        -webkit-appearance: none;
        align-items: center;
        border: ${remify(1)} solid transparent;
        border-radius: ${remify(4)};
        box-shadow: inset 0 0.0625em 0.125em rgb(10 10 10 / 5%);
        display: inline-flex;
        font-size: ${remify(16)};
        height: 2.5em;
        justify-content: flex-start;
        line-height: 1.5;
        padding-bottom: calc(0.5em - ${remify(1)});
        padding-left: calc(0.75em - ${remify(1)});
        padding-right: calc(0.75em - ${remify(1)});
        padding-top: calc(0.5em - ${remify(1)});
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

    .filter {
        -moz-appearance: none;
        -webkit-appearance: none;
        appearance: none;
        height: 2.5em;
        font-size: ${remify(16)};
        border: ${remify(1)} solid #dbdbdb;
        border-radius: ${remify(4)};
        background-color: white;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23363636' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' d='M4 6l4 4 4-4'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 0.75em center;
        background-size: 0.75em;
        color: #363636;
        padding: 0 2.25em 0 0.75em;
    }

    .heading-cell, .data-cell {
        font-weight: normal;
        padding: 1em;
        margin: 0;
        line-height: 0;
        border: ${remify(1)} solid #dbdbdb;
    }

    .heading-cell {
        font-weight: 600;
    }

    .pagination {
        text-align: right;
        margin-top: ${remify(7)};
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
    },

    filter(){
        this.on('change', event => {
            const url = new URL(this.frame.url);
            const search = new URLSearchParams(url.search);
            search.set(event.target.name, event.target.value);
            search.delete('page');
            url.search = search.toString();
            this.frame.load(url);
        });
    }
};

export default {
    render(){
        return this.renderHtml`
            <blognami-modal height="full">
                ${this.renderView('_blognami/_panel', {
                    title: this.params.title,
                    body: this.renderHtml`
                        ${() => {
                            if(this.params.search || this.params.filters?.length) return this.renderHtml`
                                <div class="${this.cssClasses.toolbar}">
                                    ${() => {
                                        if(this.params.search) return this.renderHtml`
                                            <div class="${this.cssClasses.search}">
                                                <input type="search" placeholder="Search" name="q" autocomplete="off" />
                                            </div>
                                        `;
                                    }}
                                    ${(this.params.filters ?? []).map(filter => this.renderHtml`
                                        <select class="${this.cssClasses.filter}" name="${filter.name}">
                                            ${filter.options.map(option => this.renderHtml`
                                                <option value="${option.value}"${option.value == filter.value ? this.renderHtml` selected="selected"` : ''}>${option.label}</option>
                                            `)}
                                        </select>
                                    `)}
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
                                            ${this.renderView('_blognami/_pagination', {
                                                pageCount: this.params.pageCount,
                                                page: this.params.page,
                                                q: this.params.q,
                                                ...Object.fromEntries((this.params.filters ?? []).map(filter => [filter.name, filter.value])),
                                            })}
                                        </div>
                                    `;
                                }}
                            `;
                        }}
                    `,
                    footer: this.renderView('_blognami/_button', {
                        body: this.renderHtml`
                            Close
                            <script type="blognami">
                                this.parent.on('click', () => this.trigger('close'));
                            </script>
                        `,
                    })
                })}
            </blognami-modal>
        `;
    }
};
