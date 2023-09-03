
export default {
    render(){
        return this.renderView('_layout', {
            title: "Loading post...",
            body: this.renderHtml`
                <section class="section">
                    <article class="article">
                        <blognami-skeleton>
                            <h1 class="article-title">Loading post...</h1>
                        </blognami-skeleton>
                    </article>
                </section>
            `
        });
    }
}