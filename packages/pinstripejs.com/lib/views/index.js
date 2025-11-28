
export const styles = ({ colors, breakpointFor, remify }) => `
    .hero {
        text-align: center;
        padding: ${remify(48)} ${remify(16)} ${remify(32)};
        border-bottom: ${remify(1)} solid ${colors.gray[200]};
        margin-bottom: ${remify(32)};
    }

    .logo {
        width: ${remify(80)};
        height: ${remify(80)};
        color: ${colors.gray[800]};
        margin-bottom: ${remify(24)};
    }

    .title {
        font-size: ${remify(32)};
        font-weight: 700;
        color: ${colors.gray[900]};
        margin: 0 0 ${remify(16)} 0;
        letter-spacing: -0.02em;
    }

    .subtitle {
        font-size: ${remify(18)};
        color: ${colors.gray[600]};
        margin: 0 0 ${remify(32)} 0;
        line-height: 1.6;
        max-width: ${remify(600)};
        margin-left: auto;
        margin-right: auto;
    }

    .cta-group {
        display: flex;
        flex-direction: column;
        gap: ${remify(12)};
        align-items: center;
    }

    .cta-primary {
        display: inline-flex;
        align-items: center;
        gap: ${remify(8)};
        background: ${colors.gray[900]};
        color: ${colors.white};
        padding: ${remify(12)} ${remify(24)};
        border-radius: ${remify(8)};
        text-decoration: none;
        font-weight: 500;
        transition: background 0.2s ease;
    }

    .cta-primary:hover {
        background: ${colors.gray[700]};
    }

    .cta-secondary {
        display: inline-flex;
        align-items: center;
        gap: ${remify(8)};
        color: ${colors.gray[600]};
        padding: ${remify(12)} ${remify(24)};
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s ease;
    }

    .cta-secondary:hover {
        color: ${colors.gray[900]};
    }

    .quickstart {
        background: ${colors.gray[50]};
        border-radius: ${remify(8)};
        padding: ${remify(24)};
        margin-bottom: ${remify(32)};
    }

    .quickstart-title {
        font-size: ${remify(18)};
        font-weight: 600;
        color: ${colors.gray[900]};
        margin: 0 0 ${remify(16)} 0;
    }

    .quickstart pre {
        background: ${colors.gray[800]};
        color: ${colors.gray[50]};
        padding: ${remify(16)};
        border-radius: ${remify(6)};
        overflow-x: auto;
        font-family: 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', Consolas, 'Courier New', monospace;
        font-size: ${remify(14)};
        line-height: 1.5;
        margin: 0;
    }

    .features {
        margin-bottom: ${remify(32)};
    }

    .features-title {
        font-size: ${remify(24)};
        font-weight: 600;
        color: ${colors.gray[900]};
        margin: 0 0 ${remify(24)} 0;
    }

    .features-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: ${remify(16)};
    }

    .feature {
        padding: ${remify(20)};
        border: ${remify(1)} solid ${colors.gray[200]};
        border-radius: ${remify(8)};
    }

    .feature-title {
        font-size: ${remify(16)};
        font-weight: 600;
        color: ${colors.gray[900]};
        margin: 0 0 ${remify(8)} 0;
    }

    .feature-desc {
        font-size: ${remify(15)};
        color: ${colors.gray[600]};
        margin: 0;
        line-height: 1.5;
    }

    .section {
        margin-bottom: ${remify(32)};
    }

    .section-title {
        font-size: ${remify(24)};
        font-weight: 600;
        color: ${colors.gray[900]};
        margin: 0 0 ${remify(16)} 0;
    }

    .section-text {
        font-size: ${remify(17)};
        color: ${colors.gray[600]};
        line-height: 1.7;
        margin: 0 0 ${remify(16)} 0;
    }

    .section-text a {
        color: ${colors.gray[900]};
        text-decoration: underline;
    }

    .section-text a:hover {
        opacity: 0.8;
    }

    .highlight-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .highlight-list li {
        padding: ${remify(12)} 0;
        border-bottom: ${remify(1)} solid ${colors.gray[100]};
        font-size: ${remify(16)};
        color: ${colors.gray[700]};
    }

    .highlight-list li:last-child {
        border-bottom: none;
    }

    .highlight-list strong {
        color: ${colors.gray[900]};
    }

    ${breakpointFor('sm')} {
        .cta-group {
            flex-direction: row;
            justify-content: center;
        }
    }

    ${breakpointFor('md')} {
        .hero {
            padding: ${remify(64)} ${remify(24)} ${remify(48)};
        }

        .logo {
            width: ${remify(96)};
            height: ${remify(96)};
        }

        .title {
            font-size: ${remify(42)};
        }

        .subtitle {
            font-size: ${remify(20)};
        }

        .features-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    ${breakpointFor('lg')} {
        .features-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }
`;

export default {
    meta(){
        this.annotate({
            menus: {
                sidebar: ['Getting Started', 'Introduction']
            }
        });
    },

    render(){
        const body = this.renderHtml`
            <div class="${this.cssClasses.hero}">
                <svg class="${this.cssClasses.logo}" viewBox="4455 2363 2090 2413" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" fill-rule="nonzero" d="M5544 2389c334,192 667,385 1001,578l0 1205 -511 295 0 0c-178,103 -356,206 -534,309 -159,-92 -317,-184 -476,-275l0 -1206c158,-92 317,-184 476,-275l250 144 -1 0 227 131 0 549c-158,92 -317,184 -476,275 -100,-57 -200,-115 -300,-173l0 125 300 173 584 -337 0 -675 -291 -168 -1 0 -292 -169 -584 337 0 1207 -177 -102 0 -1206 370 -214 0 0c130,-75 261,-150 391,-225l391 225 0 0 370 214 0 878c-254,146 -508,292 -761,439l-300 -173 0 125 300 173 868 -502 0 -1003 -433 -250 -1 -1 -434 -250 -868 501 0 1206 -177 -102 0 -1205c348,-202 697,-403 1045,-604l44 26zm-344 1354l300 173 150 -87 1 0 149 -86 0 -347 -300 -173 -300 173 0 347z"/>
                </svg>
                <h1 class="${this.cssClasses.title}">Pinstripe JS</h1>
                <p class="${this.cssClasses.subtitle}">
                    A modern, lightweight JavaScript web framework for building fast, scalable applications with minimal configuration.
                </p>
                <div class="${this.cssClasses['cta-group']}">
                    <a href="#quickstart" class="${this.cssClasses['cta-primary']}">
                        Get Started
                    </a>
                    <a href="https://github.com/blognami/blognami" class="${this.cssClasses['cta-secondary']}">
                        View on GitHub
                    </a>
                </div>
            </div>

            <div class="${this.cssClasses.quickstart}">
                <h2 class="${this.cssClasses['quickstart-title']}" id="quickstart">Quick Start</h2>
                <pre><code>npx pinstripe generate-project my-app
cd my-app
npx pinstripe initialize-database
npx pinstripe start-server</code></pre>
            </div>

            <div class="${this.cssClasses.features}">
                <h2 class="${this.cssClasses['features-title']}" id="features">Features</h2>
                <div class="${this.cssClasses['features-grid']}">
                    <div class="${this.cssClasses.feature}">
                        <h3 class="${this.cssClasses['feature-title']}">File-based Routing</h3>
                        <p class="${this.cssClasses['feature-desc']}">Organize your app structure intuitively with automatic route generation.</p>
                    </div>
                    <div class="${this.cssClasses.feature}">
                        <h3 class="${this.cssClasses['feature-title']}">Server-side Rendering</h3>
                        <p class="${this.cssClasses['feature-desc']}">Fast initial page loads and SEO-friendly content out of the box.</p>
                    </div>
                    <div class="${this.cssClasses.feature}">
                        <h3 class="${this.cssClasses['feature-title']}">Built-in Styling</h3>
                        <p class="${this.cssClasses['feature-desc']}">Scoped CSS with theme system for consistent, maintainable styles.</p>
                    </div>
                    <div class="${this.cssClasses.feature}">
                        <h3 class="${this.cssClasses['feature-title']}">Database Integration</h3>
                        <p class="${this.cssClasses['feature-desc']}">SQLite for development, MySQL for production.</p>
                    </div>
                    <div class="${this.cssClasses.feature}">
                        <h3 class="${this.cssClasses['feature-title']}">Multi-tenant Support</h3>
                        <p class="${this.cssClasses['feature-desc']}">Build SaaS applications with built-in multi-tenancy from day one.</p>
                    </div>
                    <div class="${this.cssClasses.feature}">
                        <h3 class="${this.cssClasses['feature-title']}">CLI Tools</h3>
                        <p class="${this.cssClasses['feature-desc']}">Generate models, migrations, services, and more with simple commands.</p>
                    </div>
                </div>
            </div>

            <div class="${this.cssClasses.section}">
                <h2 class="${this.cssClasses['section-title']}" id="why-pinstripe">Why Pinstripe?</h2>
                <ul class="${this.cssClasses['highlight-list']}">
                    <li><strong>Built for Real Projects</strong> - Powers production applications like <a href="https://blognami.com">Blognami</a>. Every feature solves a genuine problem.</li>
                    <li><strong>Zero to Production Fast</strong> - From generate-project to deployed application in minutes, not hours.</li>
                    <li><strong>Batteries Included</strong> - Authentication, database migrations, background jobs, email, and multi-tenancy built in.</li>
                </ul>
            </div>

            <div class="${this.cssClasses.section}">
                <h2 class="${this.cssClasses['section-title']}" id="symbiotic-relationship">Pinstripe & Blognami</h2>
                <p class="${this.cssClasses['section-text']}">
                    <strong>Blognami</strong> and <strong>Pinstripe</strong> are designed to benefit each other:
                </p>
                <ul class="${this.cssClasses['highlight-list']}">
                    <li><strong>Blognami</strong> showcases Pinstripe's capabilities and ensures every framework feature solves real-world problems</li>
                    <li><strong>Pinstripe</strong> stays lean and focused because it's tested against actual production needs, not just demo apps</li>
                    <li>You get a framework that's both flexible for custom applications and proven in production</li>
                </ul>
                <p class="${this.cssClasses['section-text']}">
                    When you build with Pinstripe, you're building on a foundation that's already running real businesses.
                </p>
            </div>

            <div class="${this.cssClasses.section}">
                <h2 class="${this.cssClasses['section-title']}" id="try-with-blognami">Try with Blognami</h2>
                <p class="${this.cssClasses['section-text']}">
                    Experience Pinstripe with <a href="https://blognami.com">Blognami</a>, a full-featured blogging platform:
                </p>
                <pre><code>npx pinstripe generate-project my-blog --with blognami
cd my-blog
npx pinstripe initialize-database
npx pinstripe start-server</code></pre>
            </div>
        `;

        return this.renderView('_layout', { body });
    }
};
