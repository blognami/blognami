
export default {
    async render(){
        const { name: packageName } = await this.project;
        const capitalizedPackageName = this.inflector.capitalize(packageName);
        const { title = capitalizedPackageName, body } = this.params;

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
                                <a class="navbar-item" href="/" data-test-id="title">${ capitalizedPackageName }</a>
                            </div>
                        </div>
                    </div>
                    <div class="site">
                        <main id="main" class="main outer">
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
                        </main>
                        <footer class="foot outer" data-test-id="footer">
                            <div class="foot-inner inner">
                                <div class="copyright">
                                    ${capitalizedPackageName} © ${new Date().getFullYear()}
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
                ${Object.keys(docs).filter(name => Object.keys(docs[name]).length > 0).map(name => {
                    const items = docs[name];

                    return this.renderHtml`
                        <section class="section" data-test-id="about-section">
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
