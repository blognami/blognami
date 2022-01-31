
export default async ({ params: { title, body, isSignedIn, user, editUrl }, renderHtml }) => renderHtml`
    <!DOCTYPE html>
    <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${title}</title>
            <link rel="stylesheet" href="/base.css">
            <script src="/bundle.js"></script>
        </head>
        <body>
            <nav class="navbar p-navbar" role="navigation" aria-label="main navigation">        
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
                                            <a class="button is-primary" href="/admin/add_post?userId=${user.id}" target="_overlay">
                                                <strong>Add</strong>
                                            </a>
                                            ${() => {
                                                if(editUrl) return renderHtml`
                                                    <a class="button is-primary" href="${editUrl}" target="_overlay">
                                                        <strong>Edit</strong>
                                                    </a>
                                                `;
                                            }}
                                            <a class="button is-primary" href="/admin/users" target="_overlay">
                                                <strong>Users</strong>
                                            </a>
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
`;
