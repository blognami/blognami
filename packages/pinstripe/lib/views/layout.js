
import { defineView } from 'pinstripe';

defineView('layout', async ({ params: { title, body, isSignedIn, user }, renderHtml }) => renderHtml`
    <!DOCTYPE html>
    <html>
        <head>
            <title>${title}</title>
            <link rel="stylesheet" href="/bundle.css">
            <script src="/bundle.js"></script>
        </head>
        <body>
            <nav class="navbar" role="navigation" aria-label="main navigation">        
                <div class="navbar-menu">
                    ${() => {
                        if(isSignedIn){
                            return renderHtml`
                                <div class="navbar-start">
                                    <div class="navbar-item">
                                        Signed in as &quot;${user.name}&quot;
                                    </div>
                                </div>
                            `;
                        }
                    }}
                    <div class="navbar-end">
                        <div class="navbar-item">
                            <div class="buttons">
                                ${() => {
                                    if(isSignedIn){
                                        return renderHtml`
                                            <a class="button is-primary" href="/sign_out" target="_overlay">
                                                <strong>Sign out</strong>
                                            </a>
                                        `;
                                    }
                                    return renderHtml`
                                        <a class="button is-primary" href="/sign_in" target="_overlay">
                                            <strong>Sign in</strong>
                                        </a>
                                    `;
                                }}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div class="container">
                ${body}
            </div>
        </body>
    </html>
`);
