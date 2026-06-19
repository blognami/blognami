
export const styles = ({ colors, remify, shadow }) => `
    .search {
        display: flex;
        margin-bottom: 1em;
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

    .pills {
        display: flex;
        flex-wrap: wrap;
        gap: ${remify(8)};
    }

    .pill {
        display: inline-flex;
        align-items: center;
        gap: ${remify(6)};
        padding: ${remify(6)} ${remify(14)};
        font-size: ${remify(14)};
        font-weight: 500;
        line-height: 1.5;
        text-decoration: none;
        border-radius: ${remify(999)};
        background-color: ${colors.white};
        border: ${remify(1)} solid ${colors.gray[300]};
        color: ${colors.gray[700]};
        cursor: pointer;
        user-select: none;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: ${shadow['2xs']};
    }

    .pill:hover {
        border-color: ${colors.gray[400]};
        box-shadow: ${shadow.xs};
        transform: translateY(-${remify(0.5)});
    }

    .is-tagged {
        background-color: ${colors.lime[500]};
        border-color: ${colors.lime[500]};
        color: ${colors.white};
    }

    .is-tagged:hover {
        background-color: ${colors.lime[600]};
        border-color: ${colors.lime[600]};
    }

    .pill-icon {
        font-size: ${remify(12)};
    }

    .is-create {
        border-style: dashed;
        border-color: ${colors.lime[600]};
        color: ${colors.lime[700]};
    }

    .is-create:hover {
        background-color: ${colors.lime[50]};
        border-color: ${colors.lime[600]};
    }

    .pagination {
        text-align: right;
        margin-top: ${remify(7)};
    }
`;

export const decorators = {
    wrapper(){
        this.on('close', (event) => {
            event.stopPropagation();
            this.frame.frame.load();
        });
    },

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
    async render(){
        const { id, q = '' } = this.params;

        const { rows, pageCount, page } = await this.database.tags
            .orderBy('name')
            .paginate(this.params.page)
            .toTableAdapter({ q, search: ['name'] });

        const taggedTagIds = new Set(
            (await this.database.tagableTags.where({ tagableId: id }).all()).map(({ tagId }) => tagId)
        );

        const trimmedQ = `${q}`.trim();
        const showCreatePill = trimmedQ !== '' &&
            !rows.some(({ name }) => name.toLowerCase() === trimmedQ.toLowerCase());

        return this.renderHtml`
            <div class="${this.cssClasses.wrapper}">
                <pinstripe-modal height="full">
                    ${this.renderView('_pinstripe/_panel', {
                        title: 'Tags',
                        body: this.renderHtml`
                            <div class="${this.cssClasses.search}">
                                <input type="search" placeholder="Search or create tags" name="q" autocomplete="off" />
                            </div>
                            <div class="${this.cssClasses.pills}">
                                ${rows.map(({ id: tagId, name }) => {
                                    const isTagged = taggedTagIds.has(tagId);
                                    return this.renderHtml`
                                        <a
                                            class="${this.cssClasses.pill} ${isTagged ? this.cssClasses.isTagged : ''}"
                                            target="_overlay"
                                            data-method="post"
                                            href="/_actions/admin/toggle_tagable_tag?id=${id}&tagId=${tagId}"
                                        >${name}${() => {
                                            if(isTagged) return this.renderHtml`<span class="${this.cssClasses.pillIcon}">✓</span>`;
                                        }}</a>
                                    `;
                                })}
                                ${() => {
                                    if(showCreatePill) return this.renderHtml`
                                        <a
                                            class="${this.cssClasses.pill} ${this.cssClasses.isCreate}"
                                            target="_overlay"
                                            data-method="post"
                                            data-test-id="create-tag"
                                            href="/_actions/admin/create_tagable_tag?id=${id}&name=${encodeURIComponent(trimmedQ)}"
                                        >+ Create "${trimmedQ}"</a>
                                    `;
                                }}
                                ${() => {
                                    if(rows.length === 0 && !showCreatePill) return this.renderHtml`
                                        <p>No tags found.</p>
                                    `;
                                }}
                            </div>
                            ${() => {
                                if(pageCount > 1) return this.renderHtml`
                                    <div class="${this.cssClasses.pagination}">
                                        ${this.renderView('_pinstripe/_pagination', { pageCount, page, q })}
                                    </div>
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
            </div>
        `;
    }
};
