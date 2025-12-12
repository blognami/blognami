
export const styles = ({ colors, breakpointFor, remify }) => `
    .hero {
        height: calc(100vh - ${remify(48)});
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 ${remify(16)};
    }

    .hero-container {
        max-width: ${remify(800)};
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: ${remify(16)};
        position: relative;
        top: ${remify(-48)};
        text-align: center;
    }

    .hero-logo {
        max-width: ${remify(200)};
        height: auto;
    }

    .hero-tagline {
        font-size: ${remify(18)};
        color: ${colors.gray[600]};
        margin: 0;
        line-height: 1.6;
    }

    .hero-buttons {
        display: flex;
        gap: ${remify(12)};
        margin-top: ${remify(16)};
    }

    .hero-buttons a {
        min-width: ${remify(150)};
    }

    .content {
        max-width: ${remify(800)};
        margin: 0 auto;
        padding: ${remify(16)};
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
        max-width: 100%;
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

    .section pre {
        background: ${colors.gray[800]};
        color: ${colors.gray[50]};
        padding: ${remify(16)};
        border-radius: ${remify(6)};
        overflow-x: auto;
        max-width: 100%;
        font-family: 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', Consolas, 'Courier New', monospace;
        font-size: ${remify(14)};
        line-height: 1.5;
        margin: 0;
    }

    .two-columns {
        display: grid;
        grid-template-columns: 1fr;
        gap: ${remify(24)};
    }

    .column {
        padding: ${remify(20)};
        border: ${remify(1)} solid ${colors.gray[200]};
        border-radius: ${remify(8)};
    }

    .column-title {
        font-size: ${remify(18)};
        font-weight: 600;
        color: ${colors.gray[900]};
        margin: 0 0 ${remify(12)} 0;
    }

    .column-text {
        font-size: ${remify(15)};
        color: ${colors.gray[600]};
        line-height: 1.6;
        margin: 0 0 ${remify(12)} 0;
    }

    .column-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .column-list li {
        font-size: ${remify(15)};
        color: ${colors.gray[700]};
        padding: ${remify(4)} 0;
    }

    ${breakpointFor('md')} {
        .hero-tagline {
            font-size: ${remify(20)};
        }

        .hero-logo {
            max-width: ${remify(280)};
        }

        .features-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .two-columns {
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
    render(){
        const body = this.renderHtml`
            <div class="${this.cssClasses.hero}">
                <div class="${this.cssClasses.heroContainer}">
                    <img src="/images/logo.svg" alt="Blognami" class="${this.cssClasses.heroLogo}" />
                    <p class="${this.cssClasses.heroTagline}">A blogging platform that won't box you in.</p>
                    <div class="${this.cssClasses.heroButtons}">
                        ${this.renderView('_button', {
                            tagName: 'a',
                            isPrimary: true,
                            href: '/docs/guides/getting-started',
                            body: 'Get started',
                        })}
                        ${this.renderView('_button', {
                            tagName: 'a',
                            href: '/_actions/guest/add_blog',
                            target: '_overlay',
                            body: 'Demo',
                        })}
                    </div>
                </div>
            </div>

            <div class="${this.cssClasses.content}">
                <div class="${this.cssClasses.quickstart}">
                    <h2 class="${this.cssClasses.quickstartTitle}" id="quick-start">Quick Start</h2>
                    <pre><code>npx pinstripe generate-project my-blog --with blognami
cd my-blog
npx pinstripe initialize-database
npx pinstripe start-server</code></pre>
                </div>

                <div class="${this.cssClasses.features}">
                    <h2 class="${this.cssClasses.featuresTitle}" id="features">Features</h2>
                    <div class="${this.cssClasses.featuresGrid}">
                        <div class="${this.cssClasses.feature}">
                            <h3 class="${this.cssClasses.featureTitle}">Markdown-first Editing</h3>
                            <p class="${this.cssClasses.featureDesc}">Write in markdown with live preview. Minimal, fast, focused.</p>
                        </div>
                        <div class="${this.cssClasses.feature}">
                            <h3 class="${this.cssClasses.featureTitle}">Passwordless Authentication</h3>
                            <p class="${this.cssClasses.featureDesc}">One-time codes by default. Smoother UX, fewer secrets to store.</p>
                        </div>
                        <div class="${this.cssClasses.feature}">
                            <h3 class="${this.cssClasses.featureTitle}">Posts and Pages</h3>
                            <p class="${this.cssClasses.featureDesc}">Blog posts for your timeline, pages for evergreen content.</p>
                        </div>
                        <div class="${this.cssClasses.feature}">
                            <h3 class="${this.cssClasses.featureTitle}">Tag System</h3>
                            <p class="${this.cssClasses.featureDesc}">Organize and categorize your content with flexible tagging.</p>
                        </div>
                        <div class="${this.cssClasses.feature}">
                            <h3 class="${this.cssClasses.featureTitle}">Multi-tenant Ready</h3>
                            <p class="${this.cssClasses.featureDesc}">Support multiple blogs from one installation out of the box.</p>
                        </div>
                        <div class="${this.cssClasses.feature}">
                            <h3 class="${this.cssClasses.featureTitle}">Self-hosting Friendly</h3>
                            <p class="${this.cssClasses.featureDesc}">SQLite for dev, plug in heavier DBs for prod. Zero-bloat philosophy.</p>
                        </div>
                    </div>
                </div>

                <div class="${this.cssClasses.section}">
                    <h2 class="${this.cssClasses.sectionTitle}" id="why-blognami">Why Blognami?</h2>
                    <ul class="${this.cssClasses.highlightList}">
                        <li><strong>Built for Writers</strong> — Clean markdown editor with live preview. No distractions, just focused writing.</li>
                        <li><strong>Passwordless by Design</strong> — One-time codes replace traditional passwords. Better security, smoother experience.</li>
                        <li><strong>Zero to Production Fast</strong> — From idea to published blog in minutes. Blognami handles the infrastructure so you can focus on content.</li>
                        <li><strong>Self-Host or SaaS</strong> — Own your stack completely or let us handle hosting. Switch between options anytime.</li>
                    </ul>
                </div>

                <div class="${this.cssClasses.section}">
                    <h2 class="${this.cssClasses.sectionTitle}" id="blognami-and-pinstripe">Blognami & Pinstripe</h2>
                    <p class="${this.cssClasses.sectionText}">
                        <strong>Blognami</strong> and <strong>Pinstripe</strong> are designed to work together seamlessly:
                    </p>
                    <ul class="${this.cssClasses.highlightList}">
                        <li><strong>Blognami</strong> is the complete blogging application with posts, pages, tags, and user management</li>
                        <li><strong>Pinstripe</strong> is the underlying web framework that powers Blognami's features</li>
                        <li>You get a proven blogging platform built on a framework that's tested in production</li>
                    </ul>
                    <p class="${this.cssClasses.sectionText}">
                        Want to learn more about the framework? Visit <a href="https://pinstripejs.com">pinstripejs.com</a>.
                    </p>
                </div>

                <div class="${this.cssClasses.section}">
                    <h2 class="${this.cssClasses.sectionTitle}" id="two-ways-to-use">Two Ways to Use Blognami</h2>
                    <div class="${this.cssClasses.twoColumns}">
                        <div class="${this.cssClasses.column}">
                            <h3 class="${this.cssClasses.columnTitle}">Self-Host (Open Source)</h3>
                            <p class="${this.cssClasses.columnText}">Own the stack from day one. Perfect for teams that like control.</p>
                            <ul class="${this.cssClasses.columnList}">
                                <li>✅ Local dev in minutes</li>
                                <li>✅ Use your infra + CI/CD</li>
                                <li>✅ Extend and customize freely</li>
                                <li>✅ MIT licensed and transparent</li>
                            </ul>
                        </div>
                        <div class="${this.cssClasses.column}">
                            <h3 class="${this.cssClasses.columnTitle}">Hosted (SaaS)</h3>
                            <p class="${this.cssClasses.columnText}">Skip servers. We handle infra, updates, and backups.</p>
                            <ul class="${this.cssClasses.columnList}">
                                <li>🚀 3-day demo/trial — no credit card</li>
                                <li>🔒 Secure & maintained</li>
                                <li>📤 Export anytime</li>
                                <li>🎯 Focus purely on writing</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="${this.cssClasses.section}">
                    <h2 class="${this.cssClasses.sectionTitle}" id="open-source">Open Source</h2>
                    <p class="${this.cssClasses.sectionText}">
                        Blognami and Pinstripe live in one monorepo. Your ideas matter here.
                    </p>
                    <ul class="${this.cssClasses.highlightList}">
                        <li><strong>Star the project</strong> — it helps others discover us</li>
                        <li><strong>Issues & ideas</strong> — <a href="https://github.com/blognami/blognami/issues">github.com/blognami/blognami/issues</a></li>
                        <li><strong>Contribute</strong> — pick a package, open a PR, shape the direction</li>
                    </ul>
                </div>
            </div>
        `;

        return this.renderView('_layout', { body });
    }
};
