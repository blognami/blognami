
export default {
    async render(){
        return  this.renderHtml`
            ${this.params.posts.all().map(({ slug, title, excerptFromBody, readingMinutes, publishedAt } ) => this.renderHtml`
                <article class="feed-item">
                    <a class="feed-item-link" href="/${slug}" data-placeholder="/placeholders/post">
                        <header class="feed-item-header">
                            <h2 class="feed-item-title">${title}</h2>
                        </header>
        
                        <div class="feed-item-excerpt">${excerptFromBody}</div>
        
                        <footer class="feed-item-meta">
                            ${() => {
                                if(publishedAt) return this.renderHtml`
                                    <time class="feed-item-date" datetime="${this.formatDate(publishedAt, 'yyyy-MM-dd')}">${this.formatDate(publishedAt)}</time>
                                    —
                                `;
                            }}
                            
                            <span class="feed-item-meta-wrapper">
                                <span class="feed-item-duration">${readingMinutes} min read</span>
                            </span>
                        </footer>
                    </a>
                </article>
            `)}
        `;
    }
};