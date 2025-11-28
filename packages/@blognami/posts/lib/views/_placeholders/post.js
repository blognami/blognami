
export const styles = ({ breakpointFor, remify }) => `
    .title {
        font-size: ${remify(42)};
        font-weight: 600;
        line-height: 1;
    }

    ${breakpointFor('md')} {
        .title {
            font-size: ${remify(74)};
        }
    }
`;

export default {
    render(){
        return this.renderView('_layout', {
            meta: [{ title: "Loading post..." }],
            body: this.renderHtml`
                <section class="section">
                    <article class="article">
                        <pinstripe-skeleton>
                            <h1 class="${this.cssClasses.title}">Loading post...</h1>
                        </pinstripe-skeleton>
                    </article>
                </section>
            `
        });
    }
}