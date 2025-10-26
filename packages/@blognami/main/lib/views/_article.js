
export const styles = ({ colors }) => `
    .header {
        margin-bottom: 4rem;
    }

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
        const { meta, title, body, footer, statusBar } = this.params;

        return this.renderHtml`
            <article class="${this.cssClasses.article}">
                ${() => {
                    if(statusBar) return this.renderHtml`
                        <div class="${this.cssClasses.statusBar}">
                            ${statusBar}
                        </div>
                    `;
                }}
                
                ${() => {
                    if(meta || title) return this.renderHtml`
                        <header class="${this.cssClasses.header}">
                            ${() => {
                                if(meta) return this.renderHtml`
                                    <span class="${this.cssClasses.meta}">
                                        ${meta}
                                    </span>
                                `;
                            }}
                            
                            ${() => {
                                if(title) return this.renderHtml`
                                    <h1 class="${this.cssClasses.title}">
                                        ${title}
                                    </h1>
                                `;
                            }}
                        </header>
                    `;
                }}

                ${body}

                ${() => {
                    if(footer) return this.renderHtml`
                        <footer class="${this.cssClasses.footer}">
                            ${footer}
                        </footer>
                    `;
                }}
            </article>
        `;
    }
}