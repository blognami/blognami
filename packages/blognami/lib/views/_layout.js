
export default async ({ site, session, params, renderHtml, renderMarkdown, renderView, editUrl }) => {
    const { title, body } = params;

    let user;
    if(await session){
        user = await session.user;
    }

    const isSignedIn = user != undefined;
    const isMember = isSignedIn && (user.role == 'member' || user.role == 'paid-member');
    const isPaidMember = isSignedIn && user.role == 'paid-member';

    return renderHtml`
        <!DOCTYPE html>
        <html lang="${site.language}">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>${title || site.title}</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700&family=Inter:wght@400;500;600;700;800&display=swap">
                <link rel="stylesheet" href="/base.css">
                <link rel="stylesheet" href="/assets/css/screen.css">
                <script src="/bundle.js"></script>
                <style>
                    :root {
                        --ghost-accent-color: #FF1A75;
                        --brandcolor: #FF1A75;
                    }
                </style>
            </head>
            
            <body class="is-head-b--a_n">
                <div></div>
                <div class="bn-site">
                    <header id="bn-head" class="bn-head bn-outer">
                        <div class="bn-head-inner bn-inner">
                            <div class="bn-head-brand">
                                <a class="bn-head-logo" href="/">
                                    ${async () => {
                                        if(await site.logo){
                                            return renderHtml`<img src="${site.logo}" alt="${site.title}">`
                                        } else {
                                            return site.title;
                                        }
                                    }}
                                </a>
                                ${() => {
                                    if(isSignedIn) return renderHtml`
                                        <div>
                                            Signed in as &quot;${user.name}&quot;
                                        </div>
                                    `;
                                }}
                                <button class="bn-burger"></button>
                            </div>
            
                            <nav class="bn-head-menu">
                                ${renderMarkdown(await site.primaryNavigation)}
                            </nav>
            
                            <div class="bn-head-actions">
                                ${() => {
                                    if(isMember){
                                        return renderHtml`
                                            <a class="bn-head-btn" href="/your_account">Account</a>
                                        `;
                                    }
                                    return renderHtml`
                                        <a class="bn-head-btn" href="/sign_up">
                                            ${renderView('partials/icons/_email')}
                                            Subscribe
                                        </a>
                                    `
                                }}

                                ${() => {
                                    if(isSignedIn){
                                        return renderHtml`
                                            <a class="bn-head-btn" href="/admin/add_post?userId=${user.id}" target="_overlay">
                                                Add
                                            </a>
                                            <a class="bn-head-btn" href="/admin/users" target="_overlay">
                                                Users
                                            </a>
                                            <a class="bn-head-btn" href="/sign_out" target="_overlay">
                                                Sign out
                                            </a>
                                        `;
                                    }
                                    return renderHtml`
                                        <a class="bn-head-btn" href="/sign_in" target="_overlay">
                                            ${renderView('partials/icons/_avatar')}
                                            Sign in
                                        </a>
                                    `;
                                }}
                            </div>
                        </div>
                    </header>
            
                    ${body}

                    ${() => {
                        if(!isPaidMember) return renderHtml`
                            <div class="bn-subscribe">
                                <div class="bn-outer">
                                    <section class="bn-subscribe-inner">
                                        ${() => {
                                            if(!isMember){
                                                return renderHtml`
                                                    <h3 class="bn-subscribe-title">Subscribe to ${site.title}</h3>
                    
                                                    <div class="bn-subscribe-description">Don’t miss out on the latest issues. Sign up now to get access to the library of members-only issues.</div>
                        
                                                    <a class="bn-subscribe-input" href="/sign_up">
                                                        <div class="bn-subscribe-input-text">
                                                            ${renderView('partials/icons/_email')}
                                                            jamie@example.com
                                                        </div>
                                                        <div class="bn-subscribe-input-btn">Subscribe</div>
                                                    </a>
                                                `;
                                            }
                                            return renderHtml`
                                                <h3 class="bn-subscribe-title">Ready for unlimited access?</h3>
                    
                                                <div class="bn-subscribe-description">Upgrade to a paid account to get full access.</div>
                    
                                                <a class="bn-subscribe-btn bn-btn bn-primary-btn" href="/upgrade_account">Upgrade now</a>
                                            `;
                                        }}
                                    </section>
                                </div>
                            </div>
                        `
                    }}
            
                    <footer class="bn-foot bn-outer">
                        <div class="bn-foot-inner bn-inner">
                            <div class="bn-copyright">
                                ${site.title} © ${new Date().getFullYear()}
                            </div>
            
                            <nav class="bn-foot-menu">
                                ${renderMarkdown(await site.secondaryNavigation)}
                            </nav>
            
                            <div class="bn-powered-by">
                                <a href="https://blognami.org/" target="_blank" rel="noopener">Powered by Blognami</a>
                            </div>
                        </div>
                    </footer>
                </div>

                <div class="bn-portal-triggerbtn-wrapper">
                    <div class="bn-portal-triggerbtn-container with-label">
                        <svg id="Regular" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 26px; height: 26px; color: rgb(255, 255, 255);"><defs><style>.cls-1{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:0.8px;}</style></defs><circle class="cls-1" cx="12" cy="9.75" r="5.25"></circle><path class="cls-1" d="M18.913,20.876a9.746,9.746,0,0,0-13.826,0"></path><circle class="cls-1" cx="12" cy="12" r="11.25"></circle></svg>
                        <span class="bn-portal-triggerbtn-label"> Subscribe </span>
                    </div>
                </div>
            </body>
        </html>
    `;
}

// export default async ({ params: { title, body, isSignedIn, user, editUrl }, renderHtml }) => renderHtml`
//     <!DOCTYPE html>
//     <html>
//         <head>
//             <meta name="viewport" content="width=device-width, initial-scale=1">
//             <title>${title}</title>
//             <!-- <link rel="stylesheet" href="/base.css"> -->
//             <link rel="stylesheet" href="/assets/css/screen.css">
//             <script src="/bundle.js"></script>
//         </head>
//         <body>
            // <nav class="navbar p-navbar" role="navigation" aria-label="main navigation">        
            //     <div class="navbar-menu">
            //         ${() => {
            //             if(isSignedIn){
            //                 return renderHtml`
            //                     <div class="navbar-start">
            //                         <div class="navbar-item">
            //                             Signed in as &quot;${user.name}&quot;
            //                         </div>
            //                     </div>
            //                 `;
            //             }
            //         }}
            //         <div class="navbar-end">
            //             <div class="navbar-item">
            //                 <div class="buttons">
            //                     ${() => {
            //                         if(isSignedIn){
            //                             return renderHtml`
            //                                 <a class="button is-primary" href="/admin/add_post?userId=${user.id}" target="_overlay">
            //                                     <strong>Add</strong>
            //                                 </a>
            //                                 ${() => {
            //                                     if(editUrl) return renderHtml`
            //                                         <a class="button is-primary" href="${editUrl}" target="_overlay">
            //                                             <strong>Edit</strong>
            //                                         </a>
            //                                     `;
            //                                 }}
            //                                 <a class="button is-primary" href="/admin/users" target="_overlay">
            //                                     <strong>Users</strong>
            //                                 </a>
            //                                 <a class="button is-primary" href="/sign_out" target="_overlay">
            //                                     <strong>Sign out</strong>
            //                                 </a>
            //                             `;
            //                         }
            //                         return renderHtml`
            //                             <a class="button is-primary" href="/sign_in" target="_overlay">
            //                                 <strong>Sign in</strong>
            //                             </a>
            //                         `;
            //                     }}
                                
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
            // </nav>
//             <div class="container">
//                 ${body}
//             </div>
//         </body>
//     </html>
// `;
