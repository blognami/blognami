
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

    .nav {
        display: flex;
        align-items: center;
        gap: 3.2rem;
    }

    .nav-links {
        display: flex;
        align-items: center;
        gap: 2.4rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .nav-link {
        text-decoration: none;
        color: #6b7280;
        font-weight: 500;
        transition: color 0.2s ease;
        padding: 0.8rem 0;
    }

    .nav-link:hover {
        color: #111827;
    }

    .nav-link-active {
        color: #35D0AC;
    }

    .github-link {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        text-decoration: none;
        color: #6b7280;
        font-weight: 500;
        padding: 0.8rem 1.6rem;
        border: 1px solid #e5e7eb;
        border-radius: 0.6rem;
        transition: all 0.2s ease;
    }

    .github-link:hover {
        color: #111827;
        border-color: #d1d5db;
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
        
        .nav-links {
            display: none;
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
                            <nav class="${this.cssClasses.nav}">
                                <ul class="${this.cssClasses.navLinks}">
                                    <li><a href="/docs" class="${this.cssClasses.navLink} ${this.cssClasses.navLinkActive}">Docs</a></li>
                                    <li><a href="/tutorial" class="${this.cssClasses.navLink}">Tutorial</a></li>
                                    <li><a href="/examples" class="${this.cssClasses.navLink}">Examples</a></li>
                                    <li><a href="/blog" class="${this.cssClasses.navLink}">Blog</a></li>
                                </ul>
                                <a href="https://github.com/blognami/blognami" class="${this.cssClasses.githubLink}">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                    GitHub
                                </a>
                            </nav>
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
