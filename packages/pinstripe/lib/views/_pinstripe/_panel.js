
export const styles = ({ remify }) => `
    .root {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .header, .body, .footer {
        display: block;
        padding: ${remify(20)};
    }
    .header {
        background-color: whitesmoke;
        border-bottom: ${remify(1)} solid #dbdbdb;
        border-top-left-radius: ${remify(6)};
        border-top-right-radius: ${remify(6)};
    }
    .title {
        color: #363636;
        flex-grow: 1;
        flex-shrink: 0;
        font-size: ${remify(24)};
        line-height: 1;
    }
    .body {
        background-color: white;
        flex-grow: 1;
    }
    .footer {
        background-color: whitesmoke;
        border-bottom-left-radius: ${remify(6)};
        border-bottom-right-radius: ${remify(6)};
        border-top: ${remify(1)} solid #dbdbdb;
    }
`;

export default {
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
