
export const styles = `
    .site {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    .main {
        flex-grow: 1;
        padding-top: 8rem;
        padding-bottom: 8rem;
    }

    .outer {
        padding-right: var(--gap);
        padding-left: var(--gap);
    }

    .inner {
        max-width: 1200px;
        margin: 0 auto;
    }

    @media (max-width: 767px) {
        #main {
            padding-top: 4.8rem;
            padding-bottom: 4.8rem;
        }
    }

    .wrapper {
        display: grid;
        grid-template-columns: 4fr 2fr;
        column-gap: 2.4rem;
    }

    .sidebar {
        top: 4.8rem;
        height: max-content;
        padding-left: 4rem;
        font-size: 1.4rem;
    }

    .sidebar .section + .section {
        margin-top: 8rem;
    }

    .sidebar > *:not(:first-child) {
        margin-top: 8rem;
    }


    @media (max-width: 767px) {
        .wrapper {
            grid-template-columns: 1fr;
        }

        .sidebar {
            padding-left: 0;
            margin-top: 8rem;
        }
    }

    @media (min-width: 768px) and (max-width: 991px) {
        .sidebar {
            padding-left: 1.6rem;
        }
    }
`;


export default {
    async render(){
        const { params } = this;
        const { title, body, sidebar = true } = params;
        const site = (await this.database.site) || {};
        
        return this.renderHtml`
            <!DOCTYPE html>
            <html lang="${site.language || 'en'}">
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <title>${title || site.title}</title>
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700&family=Inter:wght@400;500;600;700;800&display=swap">
                    <link rel="stylesheet" href="/assets/stylesheets/all.css">
                    <script src="/assets/javascripts/all.js"></script>
                </head>
                
                <body>
                    ${this.renderView('_header')}
                    <div class="${this.cssClasses.site}">
                        <main id="main" class="${this.cssClasses.main} ${this.cssClasses.outer}">
                            <div class="${this.cssClasses.inner}">
                                <div class="${sidebar ? this.cssClasses.wrapper : ''}">
                                    <div data-test-id="main">
                                        ${body}
                                    </div>
                                    ${() => {
                                        if(sidebar) return this.renderHtml`
                                            <aside class="${this.cssClasses.sidebar}" data-test-id="sidebar">
                                                ${this.renderView('_sidebar')}
                                            </aside>
                                        `;
                                    }}
                                </div>
                            </div>
                        </main>
                        ${this.renderView('_footer')}
                    </div>
                </body>
            </html>
        `;
    }
};
