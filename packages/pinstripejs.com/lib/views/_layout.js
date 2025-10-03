
export const styles = `
    .root {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #ffffff;
        margin: 0;
        padding: 0;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }







    .main-content {
        flex: 1;
        display: flex;
        max-width: 1280px;
        margin: 0 auto;
        width: 100%;
        padding: 0 2.4rem;
    }

    .content {
        flex: 1;
        padding: 3.2rem 0 3.2rem 3.2rem;
        max-width: none;
    }

    .toc {
        width: 19.2rem;
        padding: 3.2rem 0 3.2rem 3.2rem;
        position: sticky;
        top: 6.4rem;
        height: calc(100vh - 6.4rem);
        overflow-y: auto;
    }

    .toc-title {
        font-size: 1.4rem;
        font-weight: 600;
        color: #111827;
        margin-bottom: 1.2rem;
    }

    .toc-links {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .toc-link {
        display: block;
        text-decoration: none;
        color: #6b7280;
        padding: 0.4rem 0;
        font-size: 1.2rem;
        transition: color 0.2s ease;
    }

    .toc-link:hover {
        color: #111827;
    }

    .toc-link-active {
        color: #35D0AC;
    }



    @media (max-width: 1024px) {
        .toc {
            display: none;
        }
    }

    @media (max-width: 768px) {
        .main-content {
            padding: 0 1.6rem;
        }
        
        .content {
            padding: 1.6rem 0;
        }
        

        

    }
`;

export default {
    render(){
        return this.renderView('_pinstripe/_shell', {
            body: this.renderHtml`
                <div class="${this.cssClasses.root}">
                    ${this.renderView('_header')}

                    <div class="${this.cssClasses.mainContent}">
                        ${this.renderView('_sidebar')}

                        <main class="${this.cssClasses.content}">
                            ${this.renderView('_pinstripe/_content', { body: this.params.body })}
                        </main>

                        <aside class="${this.cssClasses.toc}">
                            <h4 class="${this.cssClasses.tocTitle}">On This Page</h4>
                            <ul class="${this.cssClasses.tocLinks}">
                                <li><a href="#quick-start" class="${this.cssClasses.tocLink} ${this.cssClasses.tocLinkActive}">Quick Start</a></li>
                                <li><a href="#features" class="${this.cssClasses.tocLink}">Features</a></li>
                            </ul>
                        </aside>
                    </div>

                    ${this.renderView('_footer')}
                </div>
            `
        });
    }
};
