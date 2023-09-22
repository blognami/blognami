
export default {
    styles: `
        .root {
            width: 100%;
        }
        .header, .body, .footer {
            display: block;
            padding: 2.0rem;
        }
        .header {
            background-color: whitesmoke;
            border-bottom: 0.1rem solid #dbdbdb;
            border-top-left-radius: 0.6rem;
            border-top-right-radius: 0.6rem;
        }
        .title {
            color: #363636;
            flex-grow: 1;
            flex-shrink: 0;
            font-size: 2.4rem;
            line-height: 1;
        }
        .body {
            background-color: white;
        }
        .footer {
            background-color: whitesmoke;
            border-bottom-left-radius: 0.6rem;
            border-bottom-right-radius: 0.6rem;
            border-top: 0.1rem solid #dbdbdb;
        }
    `,
    
    render(){
        const { title, body, footer } = this.params;
        const {
            header = title ? this.renderHtml`
                <div class="${this.cssClasses.title}">${title}</div>
            ` : undefined
        } = this.params;

        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                ${() => {
                    if(header) return this.renderHtml`
                        <div class="${this.cssClasses.header}">
                            ${header}
                        </div>
                    `;
                }}
                <div class="${this.cssClasses.body}">
                    ${body}
                </div>
                ${() => {
                    if(footer) return this.renderHtml`
                        <div class="${this.cssClasses.footer}">
                            ${footer}
                        </div>
                    `;
                }}
            </div>
        `;
    }
};
