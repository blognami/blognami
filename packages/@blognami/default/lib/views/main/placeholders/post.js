
export default {
    render(){
        return this.renderView('_layout', {
            title: "Loading post...",
            body: this.renderHtml`
                <section class="section">
                    <article class="article">
                        <pinstripe-skeleton>
                            <h1 class="article-title">Loading post...</h1>
                        </pinstripe-skeleton>
                    </article>
                </section>
            `
        });
    }
}