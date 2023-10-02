<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <title>Blognami</title>
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
                                <a class="navbar-button " href="/">Home</a>
                                <a class="navbar-button is-selected" href="/docs/guides/introduction">Docs</a>
                                <a class="navbar-button" href="https://github.com/blognami" target="_blank">Github</a>
                            </div>
                        </div>
                    </div>
                    <div class="site">
                        <main id="main" class="main outer">
                            
                                        <div class="inner">
                                            <div class="wrapper">
                                                <div data-test-id="main">
                                                    <div class="content canvas">
                                                        
                <h1>shared/assets/javascripts/all.js view</h1>
                <pre><code>
export default {
    async render(){
        const { js } = await this.clientBuilder.build();
        return [200, { &apos;content-type&apos;: &apos;text/javascript&apos;}, [ `${js}\n//# sourceMappingURL=all.js.map` ]];
    }
};

</code></pre>

            
                                                    </div>
                                                </div>
                                                
            <aside class="sidebar" data-test-id="sidebar">
                <section class="section">
                    <h2 class="section-title">Guides</h2>
                    <ul>
                        <li><a href="/docs/guides/introduction">Introduction</a></li>
                    </ul>
                </section>
                
                        <section class="section">
                            <h2 class="section-title">apps</h2>
                            <ul>
                                
                                    <li><a href="/docs/apps/docs">docs</a></li>
                                
                                    <li><a href="/docs/apps/main">main</a></li>
                                
                            </ul>
                        </section>
                    
                        <section class="section">
                            <h2 class="section-title">commands</h2>
                            <ul>
                                
                                    <li><a href="/docs/commands/drop-database">drop-database</a></li>
                                
                                    <li><a href="/docs/commands/generate-app">generate-app</a></li>
                                
                                    <li><a href="/docs/commands/generate-command">generate-command</a></li>
                                
                                    <li><a href="/docs/commands/generate-component">generate-component</a></li>
                                
                                    <li><a href="/docs/commands/generate-migration">generate-migration</a></li>
                                
                                    <li><a href="/docs/commands/generate-model">generate-model</a></li>
                                
                                    <li><a href="/docs/commands/generate-service">generate-service</a></li>
                                
                                    <li><a href="/docs/commands/generate-static-site">generate-static-site</a></li>
                                
                                    <li><a href="/docs/commands/generate-view">generate-view</a></li>
                                
                                    <li><a href="/docs/commands/init-database">init-database</a></li>
                                
                                    <li><a href="/docs/commands/list-apps">list-apps</a></li>
                                
                                    <li><a href="/docs/commands/list-commands">list-commands</a></li>
                                
                                    <li><a href="/docs/commands/list-components">list-components</a></li>
                                
                                    <li><a href="/docs/commands/list-migrations">list-migrations</a></li>
                                
                                    <li><a href="/docs/commands/list-models">list-models</a></li>
                                
                                    <li><a href="/docs/commands/list-services">list-services</a></li>
                                
                                    <li><a href="/docs/commands/list-views">list-views</a></li>
                                
                                    <li><a href="/docs/commands/migrate-database">migrate-database</a></li>
                                
                                    <li><a href="/docs/commands/purge-old-sessions">purge-old-sessions</a></li>
                                
                                    <li><a href="/docs/commands/reset-database">reset-database</a></li>
                                
                                    <li><a href="/docs/commands/seed-database">seed-database</a></li>
                                
                                    <li><a href="/docs/commands/show-config">show-config</a></li>
                                
                                    <li><a href="/docs/commands/start-repl">start-repl</a></li>
                                
                                    <li><a href="/docs/commands/start-server">start-server</a></li>
                                
                            </ul>
                        </section>
                    
                        <section class="section">
                            <h2 class="section-title">components</h2>
                            <ul>
                                
                                    <li><a href="/docs/components/pinstripe-anchor">pinstripe-anchor</a></li>
                                
                                    <li><a href="/docs/components/pinstripe-body">pinstripe-body</a></li>
                                
                                    <li><a href="/docs/components/pinstripe-document">pinstripe-document</a></li>
                                
                                    <li><a href="/docs/components/pinstripe-form">pinstripe-form</a></li>
                                
                                    <li><a href="/docs/components/pinstripe-frame">pinstripe-frame</a></li>
                                
                                    <li><a href="/docs/components/pinstripe-modal">pinstripe-modal</a></li>
                                
                                    <li><a href="/docs/components/pinstripe-overlay">pinstripe-overlay</a></li>
                                
                                    <li><a href="/docs/components/pinstripe-progress-bar">pinstripe-progress-bar</a></li>
                                
                                    <li><a href="/docs/components/pinstripe-script">pinstripe-script</a></li>
                                
                                    <li><a href="/docs/components/pinstripe-skeleton">pinstripe-skeleton</a></li>
                                
                            </ul>
                        </section>
                    
                        <section class="section">
                            <h2 class="section-title">services</h2>
                            <ul>
                                
                                    <li><a href="/docs/services/app">app</a></li>
                                
                                    <li><a href="/docs/services/args">args</a></li>
                                
                                    <li><a href="/docs/services/bot">bot</a></li>
                                
                                    <li><a href="/docs/services/cliUtils">cliUtils</a></li>
                                
                                    <li><a href="/docs/services/clientBuilder">clientBuilder</a></li>
                                
                                    <li><a href="/docs/services/config">config</a></li>
                                
                                    <li><a href="/docs/services/cookies">cookies</a></li>
                                
                                    <li><a href="/docs/services/createModel">createModel</a></li>
                                
                                    <li><a href="/docs/services/database">database</a></li>
                                
                                    <li><a href="/docs/services/defer">defer</a></li>
                                
                                    <li><a href="/docs/services/docs">docs</a></li>
                                
                                    <li><a href="/docs/services/fetch">fetch</a></li>
                                
                                    <li><a href="/docs/services/formatDate">formatDate</a></li>
                                
                                    <li><a href="/docs/services/fsBuilder">fsBuilder</a></li>
                                
                                    <li><a href="/docs/services/inflector">inflector</a></li>
                                
                                    <li><a href="/docs/services/initialParams">initialParams</a></li>
                                
                                    <li><a href="/docs/services/params">params</a></li>
                                
                                    <li><a href="/docs/services/parseHtml">parseHtml</a></li>
                                
                                    <li><a href="/docs/services/project">project</a></li>
                                
                                    <li><a href="/docs/services/renderForm">renderForm</a></li>
                                
                                    <li><a href="/docs/services/renderHtml">renderHtml</a></li>
                                
                                    <li><a href="/docs/services/renderMarkdown">renderMarkdown</a></li>
                                
                                    <li><a href="/docs/services/renderView">renderView</a></li>
                                
                                    <li><a href="/docs/services/repl">repl</a></li>
                                
                                    <li><a href="/docs/services/runCommand">runCommand</a></li>
                                
                                    <li><a href="/docs/services/runInNewWorkspace">runInNewWorkspace</a></li>
                                
                                    <li><a href="/docs/services/sendMail">sendMail</a></li>
                                
                                    <li><a href="/docs/services/server">server</a></li>
                                
                                    <li><a href="/docs/services/session">session</a></li>
                                
                                    <li><a href="/docs/services/view">view</a></li>
                                
                            </ul>
                        </section>
                    
                        <section class="section">
                            <h2 class="section-title">views</h2>
                            <ul>
                                
                                    <li><a href="/docs/views/docs/_404">docs/_404</a></li>
                                
                                    <li><a href="/docs/views/docs/_layout">docs/_layout</a></li>
                                
                                    <li><a href="/docs/views/docs/assets/stylesheets/components/home.css">docs/assets/stylesheets/components/home.css</a></li>
                                
                                    <li><a href="/docs/views/docs/assets/stylesheets/components/navbar.css">docs/assets/stylesheets/components/navbar.css</a></li>
                                
                                    <li><a href="/docs/views/docs/default">docs/default</a></li>
                                
                                    <li><a href="/docs/views/docs/docs/default">docs/docs/default</a></li>
                                
                                    <li><a href="/docs/views/docs/index">docs/index</a></li>
                                
                                    <li><a href="/docs/views/shared/_button">shared/_button</a></li>
                                
                                    <li><a href="/docs/views/shared/_form">shared/_form</a></li>
                                
                                    <li><a href="/docs/views/shared/_panel">shared/_panel</a></li>
                                
                                    <li><a href="/docs/views/shared/assets/javascripts/all.js">shared/assets/javascripts/all.js</a></li>
                                
                                    <li><a href="/docs/views/shared/assets/javascripts/all.js.map">shared/assets/javascripts/all.js.map</a></li>
                                
                                    <li><a href="/docs/views/shared/assets/stylesheets/all.css">shared/assets/stylesheets/all.css</a></li>
                                
                                    <li><a href="/docs/views/shared/assets/stylesheets/components/article.css">shared/assets/stylesheets/components/article.css</a></li>
                                
                                    <li><a href="/docs/views/shared/assets/stylesheets/components/comments.css">shared/assets/stylesheets/components/comments.css</a></li>
                                
                                    <li><a href="/docs/views/shared/assets/stylesheets/components/content.css">shared/assets/stylesheets/components/content.css</a></li>
                                
                                    <li><a href="/docs/views/shared/assets/stylesheets/components/editable_area.css">shared/assets/stylesheets/components/editable_area.css</a></li>
                                
                                    <li><a href="/docs/views/shared/assets/stylesheets/components/feed.css">shared/assets/stylesheets/components/feed.css</a></li>
                                
                                    <li><a href="/docs/views/shared/assets/stylesheets/components/footer.css">shared/assets/stylesheets/components/footer.css</a></li>
                                
                                    <li><a href="/docs/views/shared/assets/stylesheets/components/layout.css">shared/assets/stylesheets/components/layout.css</a></li>
                                
                                    <li><a href="/docs/views/shared/assets/stylesheets/components/markdown_editor.css">shared/assets/stylesheets/components/markdown_editor.css</a></li>
                                
                                    <li><a href="/docs/views/shared/assets/stylesheets/components/navbar.css">shared/assets/stylesheets/components/navbar.css</a></li>
                                
                                    <li><a href="/docs/views/shared/assets/stylesheets/components/navigation.css">shared/assets/stylesheets/components/navigation.css</a></li>
                                
                                    <li><a href="/docs/views/shared/assets/stylesheets/components/pagination.css">shared/assets/stylesheets/components/pagination.css</a></li>
                                
                                    <li><a href="/docs/views/shared/assets/stylesheets/components/section.css">shared/assets/stylesheets/components/section.css</a></li>
                                
                                    <li><a href="/docs/views/shared/assets/stylesheets/components/tags.css">shared/assets/stylesheets/components/tags.css</a></li>
                                
                                    <li><a href="/docs/views/shared/assets/stylesheets/global.css">shared/assets/stylesheets/global.css</a></li>
                                
                                    <li><a href="/docs/views/shared/assets/stylesheets/reset.css">shared/assets/stylesheets/reset.css</a></li>
                                
                                    <li><a href="/docs/views/shared/assets/stylesheets/vars.css">shared/assets/stylesheets/vars.css</a></li>
                                
                                    <li><a href="/docs/views/shared/assets/stylesheets/view.css">shared/assets/stylesheets/view.css</a></li>
                                
                            </ul>
                        </section>
                    
            </aside>
        
                                            </div>
                                        </div>
                                    
                        </main>
                        <footer class="foot outer" data-test-id="footer">
                            <div class="foot-inner inner">
                                <div class="copyright">
                                    Jody Salt © 2023
                                </div>    
                                <div class="powered-by">
                                    <a href="https://blognami.com/" target="_blank" rel="noopener">Powered by Blognami</a>
                                </div>
                            </div>
                        </footer>
                    </div>
                </body>
            </html>