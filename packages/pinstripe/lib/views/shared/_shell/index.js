
export default {
    render(){
        const { language = 'en', title = '', body } = this.params;

        return this.renderHtml`
            <!DOCTYPE html>
            <html lang="${language}">
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <title>${title}</title>
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700&family=Inter:wght@400;500;600;700;800&display=swap">
                    <link rel="stylesheet" href="/_shell/stylesheets/all.css">
                    <script src="/_shell/javascripts/all.js"></script>
                </head>
                <body>
                    ${body}
                </body>
            </html>
        `;
    }
};
