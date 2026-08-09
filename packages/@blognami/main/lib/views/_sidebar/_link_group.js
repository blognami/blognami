export const styles = ({ colors, remify }) => `
    .root {
        list-style: none;
        margin: 0 0 0 ${remify(12)};
        padding: 0;
        border-left: ${remify(1)} solid ${colors.gray[200]};
    }

    .link {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: ${remify(8)};
        text-decoration: none;
        color: ${colors.gray[700]};
        padding: ${remify(6)} ${remify(8)} ${remify(6)} ${remify(20)};
        font-size: ${remify(14)};
        border-radius: 0 ${remify(8)} ${remify(8)} 0;
        transition: color 0.18s ease, background-color 0.18s ease;
    }

    .link::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        width: ${remify(12)};
        height: ${remify(1)};
        background: ${colors.gray[200]};
    }

    .link:hover {
        color: ${colors.gray[900]};
        background: ${colors.gray[50]};
    }

    .link[data-active="true"] {
        color: ${colors.semantic.accent};
        font-weight: 600;
        background: color-mix(in oklch, ${colors.semantic.accent} 8%, transparent);
    }

    .link-label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0;
    }

    .badge {
        flex-shrink: 0;
        font-size: ${remify(11)};
        line-height: 1;
        color: ${colors.gray[400]};
    }

    .branch-row {
        display: flex;
        align-items: center;
    }

    .branch-row > .link {
        flex: 1;
        min-width: 0;
    }

    .collapse-toggle {
        border: none;
        background: none;
        font-family: inherit;
        cursor: pointer;
    }

    .chevron-button {
        display: inline-flex;
        align-items: center;
        padding: ${remify(4)};
        color: ${colors.gray[500]};
    }

    .chevron-button:hover {
        color: ${colors.gray[900]};
    }

    .toggle-row {
        width: 100%;
    }

    .row-end {
        display: inline-flex;
        align-items: center;
        gap: ${remify(4)};
    }

    .chevron {
        flex-shrink: 0;
        transition: transform 0.18s ease;
    }

    .root > li[data-collapsed="false"] > .branch-row > .chevron-button .chevron,
    .root > li[data-collapsed="false"] > .toggle-row .chevron {
        transform: rotate(90deg);
    }

    .root > li[data-collapsed="true"] > .root {
        display: none;
    }

    .root > li[data-filter-hidden="true"] {
        display: none;
    }

    [data-filtering="true"] .root > li[data-collapsed="true"] > .root {
        display: block;
    }

    [data-filtering="true"] .root > li[data-collapsed] > .branch-row .chevron,
    [data-filtering="true"] .root > li[data-collapsed] > .toggle-row .chevron {
        transform: rotate(90deg);
    }
`;

export const decorators = {
    collapseToggle(){
        this.on('click', () => {
            const branch = this.parents.find(node => node.is('[data-collapsed]'));
            const collapsed = branch.attributes['data-collapsed'] == 'true' ? 'false' : 'true';
            branch.attributes['data-collapsed'] = collapsed;
            this.attributes['aria-expanded'] = collapsed == 'true' ? 'false' : 'true';
        });
    }
};

export default {
    render(){
        const links = this.params.children;

        if (!links || links.length === 0) return;

        return this.renderHtml`
            <ul class="${this.cssClasses.root}">
                ${links.map(link => {
                    const { url, label, badge } = link;
                    const hasChildren = link.children && link.children.length > 0;

                    return this.renderHtml`
                        <li${hasChildren ? this.renderHtml` data-collapsed="true"` : ''}>
                            ${() => {
                                if (url) {
                                    const anchor = this.renderHtml`<a href="${url}" class="${this.cssClasses.link}"${link.placeholder ? this.renderHtml` data-placeholder="${link.placeholder}"` : ''}>
                                        <span class="${this.cssClasses.linkLabel}" data-filter-label>${label}</span>
                                        ${badge ? this.renderHtml`<span class="${this.cssClasses.badge}">${badge}</span>` : ''}
                                    </a>`;
                                    if (!hasChildren) return anchor;
                                    return this.renderHtml`<div class="${this.cssClasses.branchRow}">
                                        ${anchor}
                                        <button
                                            type="button"
                                            class="${this.cssClasses.collapseToggle} ${this.cssClasses.chevronButton}"
                                            aria-expanded="false"
                                            aria-label="Toggle ${label}"
                                        >${this.renderChevron()}</button>
                                    </div>`;
                                }
                                if (hasChildren) {
                                    return this.renderHtml`<button
                                        type="button"
                                        class="${this.cssClasses.link} ${this.cssClasses.collapseToggle} ${this.cssClasses.toggleRow}"
                                        aria-expanded="false"
                                    >
                                        <span class="${this.cssClasses.linkLabel}">${label}</span>
                                        <span class="${this.cssClasses.rowEnd}">
                                            ${badge ? this.renderHtml`<span class="${this.cssClasses.badge}">${badge}</span>` : ''}
                                            ${this.renderChevron()}
                                        </span>
                                    </button>`;
                                }
                                return this.renderHtml`<span class="${this.cssClasses.link}">
                                    <span class="${this.cssClasses.linkLabel}">${label}</span>
                                    ${badge ? this.renderHtml`<span class="${this.cssClasses.badge}">${badge}</span>` : ''}
                                </span>`;
                            }}
                            ${hasChildren ? this.renderView('_sidebar/_link_group', link) : ''}
                        </li>
                    `;
                })}
            </ul>
        `;
    },

    renderChevron(){
        return this.renderHtml`<svg class="${this.cssClasses.chevron}" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }
};
