
export const styles = ({ breakpointFor, remify }) => `
    .card {
        display: flex;
        flex-direction: column;
        row-gap: ${remify(14)};
    }

    .card + .card {
        margin-top: ${remify(64)};
    }

    .excerpt {
        display: flex;
        flex-direction: column;
        row-gap: ${remify(10)};
    }

    ${breakpointFor('md')} {
        .card + .card {
            margin-top: ${remify(80)};
        }
    }
`;

const rem = px => `${px / 16}rem`;

export default {
    render(){
        const line = (width, height) => this.renderHtml`<pinstripe-skeleton width="${width}" height="${rem(height)}"></pinstripe-skeleton>`;

        const card = () => this.renderHtml`
            <article class="${this.cssClasses.card}">
                ${line('80%', 32)}
                <div class="${this.cssClasses.excerpt}">
                    ${line('100%', 14)}
                    ${line('100%', 14)}
                    ${line('70%', 14)}
                </div>
                ${line('35%', 12)}
            </article>
        `;

        return this.renderView('_layout', {
            meta: [{ title: this.params.title || 'Loading...' }],
            body: this.renderView('_section', {
                title: line('45%', 12),
                body: this.renderHtml`
                    ${[0, 1, 2, 3].map(() => card())}
                `
            })
        });
    }
};
