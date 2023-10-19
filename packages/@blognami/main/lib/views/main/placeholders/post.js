
export const styles = `
    .title {
        font-size: 7.4rem;
        font-weight: 600;
        line-height: 1;
    }

    @media (max-width: 767px) {
        .title {
            font-size: 4.2rem;
        }
    }
`;

export default {
    render(){
        return this.renderView('_layout', {
            title: "Loading post...",
            body: this.renderHtml`
                <section class="section">
                    <article class="article">
                        <blognami-skeleton>
                            <h1 class="${this.cssClasses.title}">Loading post...</h1>
                        </blognami-skeleton>
                    </article>
                </section>
            `
        });
    }
}