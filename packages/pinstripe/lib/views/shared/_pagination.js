
export const styles = `
    .root {
        display: inline-flex;
        gap: 0.7em;
    }

    .page {
        text-decoration: none;
        background: #fff;
        color: #333;
        display: inline-flex;
        min-height: 1.5em;
        min-width: 1.5em;
        border-radius: 25%;
        align-items: center;
        justify-content: center;
        border: 1px solid #333;
    }

    .active {
        background: #333;
        color: white;
    }
`;

export default {
    render(){
        const { pageCount, page } = this.params;

        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                ${() => {
                    const out = [];
                    for (let i = 1; i <= pageCount; i++) {
                        out.push(this.renderHtml`
                            <a href="&page=${i}" class="${this.cssClasses.page} ${i == page ? this.cssClasses.active : ''}">${i}</a>
                        `);
                    }
                    return out;
                }}
            </div>
        `
    }
};
