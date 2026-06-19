
export const styles = ({ views, colors, shadow, remify }) => {
    const accent = views['_pinstripe/_button'].colors.primaryBackground;

    return `
    .root {
        display: inline-flex;
        align-items: center;
        gap: ${remify(6)};
    }

    .page {
        appearance: none;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: ${remify(36)};
        height: ${remify(36)};
        padding: 0 ${remify(8)};
        font-family: inherit;
        font-size: ${remify(14)};
        font-weight: 500;
        line-height: 1;
        text-decoration: none;
        background-color: ${colors.white};
        border: ${remify(1)} solid ${colors.gray[300]};
        color: ${colors.gray[700]};
        border-radius: ${remify(8)};
        cursor: pointer;
        user-select: none;
        box-shadow: ${shadow['2xs']};
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .link:hover {
        border-color: ${colors.gray[400]};
        color: ${colors.gray[900]};
        box-shadow: ${shadow.xs};
        transform: translateY(-${remify(0.5)});
    }

    .link:active {
        transform: translateY(0);
        box-shadow: ${shadow['2xs']};
    }

    .active {
        background-color: ${accent};
        border-color: ${accent};
        color: ${colors.white};
        cursor: default;
        box-shadow: 0 ${remify(2)} ${remify(4)} color-mix(in oklch, ${accent} 20%, transparent);
    }

    .disabled {
        color: ${colors.gray[300]};
        border-color: ${colors.gray[200]};
        box-shadow: none;
        cursor: default;
    }

    .ellipsis {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: ${remify(36)};
        height: ${remify(36)};
        color: ${colors.gray[400]};
        user-select: none;
    }
`;
};

export default {
    paramsFor(page){
        const otherParams = Object.fromEntries(
            Object.entries(this.params).filter(([key, value]) => value && key !== 'pageCount' && key !== 'page')
        );
        return new URLSearchParams({ ...otherParams, page });
    },

    renderArrow(label, target, disabled){
        if(disabled) return this.renderHtml`<span class="${this.cssClasses.page} ${this.cssClasses.disabled}">${label}</span>`;
        return this.renderHtml`<a href="&${this.paramsFor(target)}" class="${this.cssClasses.page} ${this.cssClasses.link}">${label}</a>`;
    },

    render(){
        const { pageCount, page } = this.params;

        const current = Number(page) || 1;

        const wanted = [1, current - 1, current, current + 1, pageCount].filter(p => p >= 1 && p <= pageCount);
        const sorted = [...new Set(wanted)].sort((a, b) => a - b);

        const items = [];
        let previous = 0;
        for (const p of sorted) {
            if (p - previous === 2) items.push(previous + 1);
            else if (p - previous > 2) items.push('ellipsis');
            items.push(p);
            previous = p;
        }

        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                ${this.renderArrow('‹', current - 1, current <= 1)}
                ${items.map(item => item === 'ellipsis'
                    ? this.renderHtml`<span class="${this.cssClasses.ellipsis}">…</span>`
                    : this.renderHtml`<a href="&${this.paramsFor(item)}" class="${this.cssClasses.page} ${item === current ? this.cssClasses.active : this.cssClasses.link}">${item}</a>`
                )}
                ${this.renderArrow('›', current + 1, current >= pageCount)}
            </div>
        `
    }
};
