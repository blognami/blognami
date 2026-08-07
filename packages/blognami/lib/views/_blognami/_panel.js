
export const styles = ({ remify, colors, radius, text, fontWeight }) => `
    .root {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: ${colors.white};
        border-radius: ${radius.lg};
        overflow: hidden;
    }
    .header, .footer {
        display: block;
        padding: ${remify(14)} ${remify(20)};
        background-color: ${colors.gray[50]};
    }
    .header {
        border-bottom: ${remify(1)} solid ${colors.gray[200]};
    }
    .footer {
        border-top: ${remify(1)} solid ${colors.gray[200]};
    }
    .title {
        color: ${colors.gray[900]};
        font-size: ${text.xl.size};
        line-height: 1.2;
        font-weight: ${fontWeight.semibold};
    }
    .body {
        display: block;
        padding: ${remify(20)};
        background-color: ${colors.white};
        flex-grow: 1;
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
