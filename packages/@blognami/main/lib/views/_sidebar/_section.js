export const styles = `
    .section {
        margin-bottom: 3.2rem;
    }

    .title {
        font-size: 1.4rem;
        font-weight: 600;
        color: #111827;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 1.2rem;
    }
`;

export default {
    render(){
        const section = this.params.section;
        
        if (!section || !section.name || !section.links || section.links.length === 0) {
            return this.renderHtml``;
        }

        return this.renderHtml`
            <div class="${this.cssClasses.section}">
                <h3 class="${this.cssClasses.title}">${section.name}</h3>
                ${this.renderView('_sidebar/_links', { links: section.links })}
            </div>
        `;
    }
};