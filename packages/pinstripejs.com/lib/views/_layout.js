
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

    .header {
        background-color: #ffffff;
        border-bottom: 1px solid #e5e7eb;
        position: sticky;
        top: 0;
        z-index: 40;
        backdrop-filter: blur(8px);
        background-color: rgba(255, 255, 255, 0.95);
    }

    .header-container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 2.4rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 6.4rem;
    }

    .logo {
        display: flex;
        align-items: center;
        gap: 1.2rem;
        text-decoration: none;
        color: #111827;
        font-weight: 600;
        font-size: 2rem;
    }

    .logo-icon {
        width: 3.2rem;
        height: 3.2rem;
        color: #35D0AC;
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

    .footer {
        border-top: 1px solid #e5e7eb;
        background-color: #f9fafb;
        padding: 4.8rem 0;
        margin-top: 6.4rem;
    }

    .footer-container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 2.4rem;
        text-align: center;
    }

    .footer-text {
        color: #6b7280;
        font-size: 1.4rem;
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
        
        .header-container {
            padding: 0 1.6rem;
        }
        

    }
`;

export default {
    render(){
        return this.renderView('_pinstripe/_shell', {
            body: this.renderHtml`
                <div class="${this.cssClasses.root}">
                    <header class="${this.cssClasses.header}">
                        <div class="${this.cssClasses.headerContainer}">
                            <a href="/" class="${this.cssClasses.logo}">
                                <svg class="${this.cssClasses.logoIcon}" viewBox="4455 2363 2090 2413" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="currentColor" fill-rule="nonzero" d="M5544 2389c334,192 667,385 1001,578l0 1205 -511 295 0 0c-178,103 -356,206 -534,309 -159,-92 -317,-184 -476,-275l0 -1206c158,-92 317,-184 476,-275l250 144 -1 0 227 131 0 549c-158,92 -317,184 -476,275 -100,-57 -200,-115 -300,-173l0 125 300 173 584 -337 0 -675 -291 -168 -1 0 -292 -169 -584 337 0 1207 -177 -102 0 -1206 370 -214 0 0c130,-75 261,-150 391,-225l391 225 0 0 370 214 0 878c-254,146 -508,292 -761,439l-300 -173 0 125 300 173 868 -502 0 -1003 -433 -250 -1 -1 -434 -250 -868 501 0 1206 -177 -102 0 -1205c348,-202 697,-403 1045,-604l44 26zm-344 1354l300 173 150 -87 1 0 149 -86 0 -347 -300 -173 -300 173 0 347z"/>
                                </svg>
                                Pinstripe JS
                            </a>
                            ${this.renderView('_navbar')}
                        </div>
                    </header>

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

                    <footer class="${this.cssClasses.footer}">
                        <div class="${this.cssClasses.footerContainer}">
                            <p class="${this.cssClasses.footerText}">
                                © 2025 Pinstripe JS. Open source JavaScript web framework.
                            </p>
                        </div>
                    </footer>
                </div>
            `
        });
    }
};
