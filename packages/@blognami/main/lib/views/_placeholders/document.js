
export const styles = ({ breakpointFor, remify }) => `
    .title {
        display: flex;
        flex-direction: column;
        row-gap: ${remify(12)};
        margin-bottom: ${remify(16)};
    }

    .paragraph {
        display: flex;
        flex-direction: column;
        row-gap: ${remify(12)};
    }

    ${breakpointFor('md')} {
        .title {
            row-gap: ${remify(16)};
            margin-bottom: ${remify(24)};
        }
    }
`;

export default {
    convertPixelsToRem(px){
        return `${px / 16}rem`;
    },

    render(){
        const line = (width, height) => this.renderHtml`<blognami-skeleton width="${width}" height="${this.convertPixelsToRem(height)}"></blognami-skeleton>`;

        const paragraph = (...widths) => this.renderHtml`
            <div class="${this.cssClasses.paragraph}">
                ${widths.map(width => line(width, 14))}
            </div>
        `;

        return this.renderView('_layout', {
            section: this.params.section,
            meta: [{ title: "Loading..." }],
            body: this.renderHtml`
                <section>
                    ${this.renderView('_meta_bar', {
                        body: line('40%', 12)
                    })}

                    ${this.renderView('_content', {
                        body: this.renderHtml`
                            <div class="${this.cssClasses.title}">
                                ${line('100%', 34)}
                                ${line('60%', 34)}
                            </div>

                            ${paragraph('100%', '100%', '100%', '65%')}
                            ${paragraph('100%', '100%', '80%')}
                            ${paragraph('100%', '100%', '100%', '50%')}
                        `
                    })}
                </section>
            `
        });
    }
}
