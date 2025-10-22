
export const styles = ({ colors }) => `
    .article {
        max-width: 650px;
    }

    .header {
        margin-bottom: 4rem;
    }
    
    .status-bar {
        margin-bottom: 2rem;
        text-align: right;
    }

    .meta {
        display: block;
        margin-bottom: 2rem;
        font-size: 1.2rem;
        font-weight: 500;
        line-height: 1;
        color: ${colors.semantic.secondaryText};
        text-transform: uppercase;
    }

    .meta a {
        font-weight: 600;
    }

    .title {
        font-size: 7.4rem;
        font-weight: 600;
        line-height: 1;
    }

    .footer {
        padding-top: 3.2rem;
        margin-top: 8rem;
        border-top: 1px solid ${colors.gray[200]};
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