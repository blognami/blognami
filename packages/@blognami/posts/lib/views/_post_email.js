
export default {
    async render(){
        const { post, user, site, postUrl } = this.params;
        const postUser = await post.user;

        return this.renderHtml`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                        <h2 style="margin: 0; font-size: 18px; color: #666;">${site.title}</h2>
                    </div>

                    <h1 style="margin: 0 0 10px; font-size: 28px; line-height: 1.3; color: #111;">${post.title}</h1>

                    <div style="margin-bottom: 20px; font-size: 14px; color: #666;">
                        By ${postUser.name}
                        ${(() => {
                            if(post.publishedAt) return this.renderHtml` &mdash; ${this.formatDate(post.publishedAt)}`;
                        })()}
                    </div>

                    <div style="margin-bottom: 30px;">
                        ${this.renderMarkdown(post.body)}
                    </div>

                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666;">
                        <p style="margin: 0 0 10px;">
                            <a href="${postUrl}" style="color: #0066cc;">View this post in your browser</a>
                        </p>
                        <p style="margin: 0; font-size: 12px;">
                            You're receiving this email because you're subscribed to ${site.title}.
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
};
