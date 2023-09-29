
export default {
    async render(){
        const { title = 'Blognami', showSidebar = true, body } = this.params;
        const { _url: { pathname } } = this.initialParams;

        return this.renderHtml`
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <title>${title}</title>
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700&family=Inter:wght@400;500;600;700;800&display=swap">
                    <link rel="stylesheet" href="/assets/stylesheets/all.css">
                    <script src="/assets/javascripts/all.js"></script>
                </head>
                
                <body>
                    <div class="navbar" data-test-id="navbar">
                        <div class="navbar-inner">
                            <div class="navbar-brand">
                                <img src="/assets/images/logo.svg">
                                <a class="navbar-item" href="/" data-test-id="title">Blognami</a>
                            </div>
                            <div class="navbar-buttons">
                                <a class="navbar-button ${pathname == '/' ? `is-selected` : ''}" href="/">Home</a>
                                <a class="navbar-button ${pathname.match(/^\/docs(|\/.*)$/) ? `is-selected` : ''}" href="/docs/guides/introduction">Docs</a>
                                <a class="navbar-button" href="https://github.com/haberdash" target="_blank">Github</a>
                            </div>
                        </div>
                    </div>
                    <div class="site">
                        <main id="main" class="main outer">
                            ${() => {
                                if(showSidebar){
                                    return this.renderHtml`
                                        <div class="inner">
                                            <div class="wrapper">
                                                <div data-test-id="main">
                                                    <div class="content canvas">
                                                        ${body}
                                                    </div>
                                                </div>
                                                ${this.renderSidebar()}
                                            </div>
                                        </div>
                                    `;
                                }
                                return body;
                            }}
                        </main>
                        <footer class="foot outer" data-test-id="footer">
                            <div class="foot-inner inner">
                                <div class="copyright">
                                    Jody Salt © ${new Date().getFullYear()}
                                </div>    
                                <div class="powered-by">
                                    <a href="https://blognami.com/" target="_blank" rel="noopener">Powered by Blognami</a>
                                </div>
                            </div>
                        </footer>
                    </div>
                </body>
            </html>
        `;
    },

    async renderSidebar(){
        const docs = await this.docs;

        return this.renderHtml`
            <aside class="sidebar" data-test-id="sidebar">
                <section class="section">
                    <h2 class="section-title">Guides</h2>
                    <ul>
                        <li><a href="/docs/guides/introduction">Introduction</a></li>
                    </ul>
                </section>
                ${Object.keys(docs).filter(name => Object.keys(docs[name]).length > 0).map(name => {
                    const items = docs[name];

                    return this.renderHtml`
                        <section class="section">
                            <h2 class="section-title">${name}</h2>
                            <ul>
                                ${Object.values(items).map(({ name, slug })  => this.renderHtml`
                                    <li><a href="/docs/${slug}">${name}</a></li>
                                `)}
                            </ul>
                        </section>
                    `
                })}
            </aside>
        `;
    }
};
