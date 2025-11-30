
export const styles = ({ colors, fonts, breakpointFor, remify }) =>`
    .root {
        margin-top: ${remify(32)};
    }

    .root img {
        height: auto;
    }

    .root a {
        color: ${colors.gray[950]};
        text-decoration: none;
    }

    .root a:hover {
        opacity: 0.8;
    }

    .root h1,
    .root h2,
    .root h3,
    .root h4,
    .root h5,
    .root h6 {
        line-height: 1.15;
        color: ${colors.gray[950]};
        letter-spacing: -0.02em;
    }

    .root h1 {
        font-size: ${remify(32)};
        font-weight: 700;
        color: ${colors.gray[900]};
        margin: 0 0 ${remify(16)} 0;
        line-height: 1.2;
    }

    .root h2 {
        font-size: ${remify(24)};
        font-weight: 600;
        color: ${colors.gray[900]};
        margin: ${remify(32)} 0 ${remify(16)} 0;
        line-height: 1.3;
    }

    .root h3 {
        font-size: ${remify(21)};
        font-weight: 600;
        color: ${colors.gray[900]};
        margin: ${remify(24)} 0 ${remify(12)} 0;
        line-height: 1.4;
    }

    .root h4 {
        font-size: ${remify(22)};
    }

    .root h5 {
        font-size: ${remify(20)};
    }

    .root h6 {
        font-size: ${remify(18)};
    }

    .root hr {
        width: 100%;
        height: ${remify(1)};
        background-color: ${colors.gray[200]};
        border: 0;
    }

    .root p {
        color: ${colors.gray[600]};
        margin-bottom: ${remify(16)};
        line-height: 1.7;
    }

    .root blockquote:not([class]) {
        padding-left: ${remify(20)};
        border-left: ${remify(4)} solid ${colors.semantic.accent};
    }

    .root figcaption {
        margin-top: ${remify(16)};
        font-size: ${remify(14)};
        line-height: 1.4;
        color: ${colors.semantic.secondaryText};
        text-align: center;
    }

    .root pre {
        background-color: ${colors.gray[800]};
        color: ${colors.gray[50]};
        padding: ${remify(24)};
        border-radius: ${remify(8)};
        overflow-x: auto;
        max-width: 100%;
        margin: ${remify(24)} 0;
        font-family: 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', Consolas, 'Courier New', monospace;
        font-size: ${remify(14)};
        line-height: 1.5;
        hyphens: none;
        white-space: pre;
        -webkit-overflow-scrolling: touch;
    }

    .root code {
        background-color: ${colors.gray[100]};
        color: ${colors.red[600]};
        padding: ${remify(2)} ${remify(4)};
        border-radius: ${remify(4)};
        font-size: 0.875em;
        font-family: 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', Consolas, 'Courier New', monospace;
    }

    .root pre > code {
        max-width: ${remify(600)};
        display: block;
        overflow: auto;
    }

    .root pre code {
        background-color: transparent;
        color: inherit;
        padding: 0;
        border-radius: 0;
        font-size: inherit;
    }

    .root :not(pre) > code {
        padding: ${remify(4)};
        color: ${colors.semantic.accent};
        background-color: ${colors.gray[50]};
        border-radius: ${remify(3)};
    }

    .root iframe {
        display: block;
        width: 100%;
        overflow: hidden;
        border: 0;
    }

    .root > * + * {
        margin-top: ${remify(20)};
        margin-bottom: 0;
    }

    .root > [id]:not(:first-child) {
        margin-top: ${remify(32)};
    }

    .root > hr,
    .root > blockquote {
        position: relative;
        margin-top: ${remify(40)};
    }

    .root > hr + *,
    .root > blockquote + * {
        margin-top: ${remify(40)};
    }

    .root h3 {
        font-weight: 600;
    }

    .root a {
        color: var(--accent-color);
        text-decoration: underline;
        word-break: break-word;
    }

    .root > blockquote:not([class]),
    .root > ol,
    .root > ul,
    .root > dl,
    .root > p {
        font-size: ${remify(17)};
        letter-spacing: var(--content-letter-spacing, 0);
    }

    .root ul,
    .root ol,
    .root dl {
        padding-left: ${remify(28)};
    }

    .root li + li {
        margin-top: ${remify(8)};
    }

    ${breakpointFor('md')} {
        .root {
            margin-top: 0;
        }

        .root h1 {
            font-size: ${remify(36)};
        }

        .root h2 {
            font-size: ${remify(30)};
        }

        .root h3 {
            font-size: ${remify(24)};
        }

        .root > * + * {
            margin-top: ${remify(28)};
        }

        .root > [id]:not(:first-child) {
            margin-top: auto;
        }

        .root > blockquote:not([class]),
        .root > ol,
        .root > ul,
        .root > dl,
        .root > p {
            font-size: var(--content-font-size, ${remify(19)});
        }
    }
`;

export default {
    render(){
        const { body, testId } = this.params;

        return this.renderHtml`
            <div class="${this.cssClasses.root}"${testId ? this.renderHtml` data-test-id="${testId}"` : ''}>
                ${body}
            </div>
        `;
    }
};
