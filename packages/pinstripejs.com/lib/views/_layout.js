
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
        padding: 0 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 4rem;
    }

    .logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        text-decoration: none;
        color: #111827;
        font-weight: 600;
        font-size: 1.25rem;
    }

    .logo-icon {
        width: 2rem;
        height: 2rem;
        color: #35D0AC;
    }

    .nav {
        display: flex;
        align-items: center;
        gap: 2rem;
    }

    .nav-links {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .nav-link {
        text-decoration: none;
        color: #6b7280;
        font-weight: 500;
        transition: color 0.2s ease;
        padding: 0.5rem 0;
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
        gap: 0.5rem;
        text-decoration: none;
        color: #6b7280;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
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
        padding: 0 1.5rem;
    }

    .sidebar {
        width: 16rem;
        padding: 2rem 0;
        border-right: 1px solid #e5e7eb;
        position: sticky;
        top: 4rem;
        height: calc(100vh - 4rem);
        overflow-y: auto;
        padding-right: 1.5rem;
    }

    .sidebar-section {
        margin-bottom: 2rem;
    }

    .sidebar-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: #111827;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.75rem;
    }

    .sidebar-links {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .sidebar-link {
        display: block;
        text-decoration: none;
        color: #6b7280;
        padding: 0.375rem 0;
        font-size: 0.875rem;
        transition: color 0.2s ease;
        border-left: 2px solid transparent;
        padding-left: 0.75rem;
        margin-left: -0.75rem;
    }

    .sidebar-link:hover {
        color: #111827;
    }

    .sidebar-link-active {
        color: #35D0AC;
        border-left-color: #35D0AC;
        background-color: rgba(53, 208, 172, 0.05);
    }

    .content {
        flex: 1;
        padding: 2rem 0 2rem 2rem;
        max-width: none;
    }

    .content h1 {
        font-size: 2.25rem;
        font-weight: 700;
        color: #111827;
        margin: 0 0 1rem 0;
        line-height: 1.2;
    }

    .content h2 {
        font-size: 1.875rem;
        font-weight: 600;
        color: #111827;
        margin: 2rem 0 1rem 0;
        line-height: 1.3;
    }

    .content h3 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #111827;
        margin: 1.5rem 0 0.75rem 0;
        line-height: 1.4;
    }

    .content p {
        color: #4b5563;
        margin-bottom: 1rem;
        line-height: 1.7;
    }

    .content code {
        background-color: #f3f4f6;
        color: #e53e3e;
        padding: 0.125rem 0.25rem;
        border-radius: 0.25rem;
        font-size: 0.875em;
        font-family: 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', Consolas, 'Courier New', monospace;
    }

    .content pre {
        background-color: #1f2937;
        color: #f9fafb;
        padding: 1.5rem;
        border-radius: 0.5rem;
        overflow-x: auto;
        margin: 1.5rem 0;
        font-family: 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', Consolas, 'Courier New', monospace;
        font-size: 0.875rem;
        line-height: 1.5;
    }

    .content pre code {
        background-color: transparent;
        color: inherit;
        padding: 0;
        border-radius: 0;
        font-size: inherit;
    }

    .toc {
        width: 12rem;
        padding: 2rem 0 2rem 2rem;
        position: sticky;
        top: 4rem;
        height: calc(100vh - 4rem);
        overflow-y: auto;
    }

    .toc-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: #111827;
        margin-bottom: 0.75rem;
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
        padding: 0.25rem 0;
        font-size: 0.75rem;
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
        padding: 3rem 0;
        margin-top: 4rem;
    }

    .footer-container {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 1.5rem;
        text-align: center;
    }

    .footer-text {
        color: #6b7280;
        font-size: 0.875rem;
    }

    @media (max-width: 1024px) {
        .toc {
            display: none;
        }
    }

    @media (max-width: 768px) {
        .sidebar {
            display: none;
        }
        
        .main-content {
            padding: 0 1rem;
        }
        
        .content {
            padding: 1rem 0;
        }
        
        .header-container {
            padding: 0 1rem;
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
                        <aside class="${this.cssClasses.sidebar}">
                            <div class="${this.cssClasses.sidebarSection}">
                                <h3 class="${this.cssClasses.sidebarTitle}">Getting Started</h3>
                                <ul class="${this.cssClasses.sidebarLinks}">
                                    <li><a href="/docs/installation" class="${this.cssClasses.sidebarLink} ${this.cssClasses.sidebarLinkActive}">Installation</a></li>
                                    <li><a href="/docs/quick-start" class="${this.cssClasses.sidebarLink}">Quick Start</a></li>
                                    <li><a href="/docs/project-structure" class="${this.cssClasses.sidebarLink}">Project Structure</a></li>
                                </ul>
                            </div>
                            <div class="${this.cssClasses.sidebarSection}">
                                <h3 class="${this.cssClasses.sidebarTitle}">Core Concepts</h3>
                                <ul class="${this.cssClasses.sidebarLinks}">
                                    <li><a href="/docs/routing" class="${this.cssClasses.sidebarLink}">Routing</a></li>
                                    <li><a href="/docs/views" class="${this.cssClasses.sidebarLink}">Views</a></li>
                                    <li><a href="/docs/models" class="${this.cssClasses.sidebarLink}">Models</a></li>
                                    <li><a href="/docs/controllers" class="${this.cssClasses.sidebarLink}">Controllers</a></li>
                                </ul>
                            </div>
                            <div class="${this.cssClasses.sidebarSection}">
                                <h3 class="${this.cssClasses.sidebarTitle}">Advanced</h3>
                                <ul class="${this.cssClasses.sidebarLinks}">
                                    <li><a href="/docs/configuration" class="${this.cssClasses.sidebarLink}">Configuration</a></li>
                                    <li><a href="/docs/deployment" class="${this.cssClasses.sidebarLink}">Deployment</a></li>
                                    <li><a href="/docs/plugins" class="${this.cssClasses.sidebarLink}">Plugins</a></li>
                                </ul>
                            </div>
                        </aside>

                        <main class="${this.cssClasses.content}">
                            <h1>Welcome to Pinstripe JS</h1>
                            <p>Pinstripe JS is a modern, lightweight JavaScript web framework designed for building fast, scalable web applications with minimal configuration.</p>
                            
                            <h2>Quick Start</h2>
                            <p>Get started with Pinstripe JS in just a few steps:</p>
                            
                            <pre><code>npm install -g pinstripe
pinstripe create my-app
cd my-app
npm start</code></pre>
                            
                            <h3>Features</h3>
                            <p>Pinstripe JS comes with everything you need to build modern web applications:</p>
                            <ul>
                                <li>File-based routing</li>
                                <li>Server-side rendering</li>
                                <li>Built-in styling system</li>
                                <li>Database integration</li>
                                <li>Multi-tenant support</li>
                            </ul>
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
