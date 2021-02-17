
export default ({ html, params: { title, body} }) => html`
    <!DOCTYPE html>
    <html>
        <head>
            <title>${title}</title>
            <link rel='stylesheet' href='/stylesheets/style.css' />
            <script src="/javascripts/pinstripe.js"></script>
        </head>
        <body>
            <nav class="navbar" role="navigation" aria-label="main navigation">
                <div id="navbarBasicExample" class="navbar-menu">
                    <div class="navbar-start">
                        <a class="navbar-item" href="/" data-test="home-link">
                            Home
                        </a>
                        <a class="navbar-item" href="/posts" data-test="posts-link">
                            Posts
                        </a>
                        <a class="navbar-item" href="/about" data-test="about-link">
                            About
                        </a>
                    </div>
                    <div class="navbar-end">
                        <div class="navbar-item">
                            <a class="button is-light">
                            Log in
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
            ${body}
        </body>
    </html>
`;
