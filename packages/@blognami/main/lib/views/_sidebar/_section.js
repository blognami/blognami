export { decorators } from './_link_group.js';

export const styles = ({ colors, remify }) => `
    .label {
        margin: 0;
    }

    .collapse-toggle {
        display: flex;
        align-items: center;
        gap: ${remify(8)};
        width: 100%;
        padding: ${remify(9)} ${remify(6)};
        border: none;
        background: none;
        border-radius: ${remify(8)};
        font-family: inherit;
        font-size: ${remify(13)};
        font-weight: 700;
        color: ${colors.gray[900]};
        text-align: left;
        cursor: pointer;
    }

    .collapse-toggle:hover {
        background: ${colors.gray[50]};
    }

    .chevron {
        flex-shrink: 0;
        color: ${colors.semantic.accent};
        transition: transform 0.18s ease;
    }

    .count {
        margin-left: auto;
        font-size: ${remify(11)};
        font-weight: 400;
        color: ${colors.gray[400]};
    }

    .body > p {
        margin: ${remify(2)} 0 ${remify(6)};
        padding: ${remify(2)} ${remify(6)};
        font-size: ${remify(14)};
        line-height: 1.55;
        color: ${colors.gray[700]};
        text-wrap: pretty;
    }

    .root[data-collapsed="false"] > .label > .collapse-toggle .chevron {
        transform: rotate(90deg);
    }

    .root[data-collapsed="true"] > .body {
        display: none;
    }

    .root[data-filter-hidden="true"] {
        display: none;
    }

    [data-filtering="true"] .root[data-collapsed="true"] > .body {
        display: block;
    }

    [data-filtering="true"] .root > .label > .collapse-toggle .chevron {
        transform: rotate(90deg);
    }

    [data-filtering="true"] .count {
        display: none;
    }
`;

export default {
    render(){
        const { label, body, testId, count } = this.params;

        return this.renderHtml`
            <div class="${this.cssClasses.root}" ${testId ? this.renderHtml`data-test-id="${testId}"` : ''} data-collapsed="true">
                <h2 class="${this.cssClasses.label}"><button
                    type="button"
                    class="${this.cssClasses.collapseToggle}"
                    aria-expanded="false"
                ><svg class="${this.cssClasses.chevron}" width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>${label}</span>${count ? this.renderHtml`<span class="${this.cssClasses.count}" aria-hidden="true">${count}</span>` : ''}</button></h2>
                <div class="${this.cssClasses.body}">${body}</div>
            </div>
        `;
    }
};
