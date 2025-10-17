
export const styles = ({ colors }) =>`
    .tags-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .tags-item + .tags-item {
        margin-top: 1.6rem;
    }

    .tags-name {
        font-size: 1.7rem;
        font-weight: 600;
        letter-spacing: 0;
    }

    .tags-count {
        padding: 0.4rem 0.8rem;
        font-size: 1.3rem;
        line-height: 1;
        border: 1px solid ${colors.gray[200]};
        border-radius: 32px;
    }
`;

export default {
    async render(){
        const tags = this.database.posts.tags.orderBy('name');

        if(await tags.count() > 0) return this.renderView('_sidebar/_section', {
            label: 'Tags',
            testId: 'tags-section',
            body: tags.all().map(({ name, slug }) => this.renderHtml`
                <a class="${this.cssClasses.tagsItem}" href="/${slug}">
                    <h4 class="${this.cssClasses.tagsName}">${name}</h4>
                    <span class="${this.cssClasses.tagsCount}">
                        ${async () => {
                            const count = await this.database.posts.where({ tags: { name } }).count();
                            if(count == 1) return this.renderHtml`
                                ${count} post
                            `;

                            return this.renderHtml`
                                ${count} posts
                            `;
                        }}
                    </span>
                </a>
            `)
        });
    }
};
