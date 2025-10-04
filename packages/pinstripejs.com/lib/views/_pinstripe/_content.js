
export const styles = ({ colors, fonts }) =>`
    .root img {
        height: auto;
    }

    .root a {
        color: #000;
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
        color: #000;
        letter-spacing: -0.02em;
    }

    .root h1 {
        font-size: 3.6rem;
        font-weight: 700;
        color: #111827;
        margin: 0 0 1.6rem 0;
        line-height: 1.2;
    }
    
    @media (max-width: 767px) {
        .root h1 {
            font-size: 3.2rem;
        }
    }

    .root h2 {
        font-size: 3rem;
        font-weight: 600;
        color: #111827;
        margin: 3.2rem 0 1.6rem 0;
        line-height: 1.3;
    }

    .root h3 {
        font-size: 2.4rem;
        font-weight: 600;
        color: #111827;
        margin: 2.4rem 0 1.2rem 0;
        line-height: 1.4;
    }

    .root h4 {
        font-size: 2.2rem;
    }

    .root h5 {
        font-size: 2rem;
    }

    .root h6 {
        font-size: 1.8rem;
    }

    .root hr {
        width: 100%;
        height: 1px;
        background-color: ${colors.gray[200]};
        border: 0;
    }

    .root p {
        color: #4b5563;
        margin-bottom: 1.6rem;
        line-height: 1.7;
    }

    .root blockquote:not([class]) {
        padding-left: 2rem;
        border-left: 4px solid ${colors.semantic.accent};
    }

    .root figcaption {
        margin-top: 1.6rem;
        font-size: 1.4rem;
        line-height: 1.4;
        color: ${colors.semantic.secondaryText};
        text-align: center;
    }

    .root pre {
        background-color: #1f2937;
        color: #f9fafb;
        padding: 2.4rem;
        border-radius: 0.8rem;
        overflow-x: auto;
        margin: 2.4rem 0;
        font-family: 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', Consolas, 'Courier New', monospace;
        font-size: 1.4rem;
        line-height: 1.5;
        hyphens: none;
        white-space: pre;
        -webkit-overflow-scrolling: touch;
    }

    .root code {
        background-color: #f3f4f6;
        color: #e53e3e;
        padding: 0.2rem 0.4rem;
        border-radius: 0.4rem;
        font-size: 0.875em;
        font-family: 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', Consolas, 'Courier New', monospace;
    }

    .root pre > code {
        max-width: 600px;
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
        padding: 0.4rem;
        color: ${colors.semantic.accent};
        background-color: ${colors.gray[50]};
        border-radius: 3px;
    }

    .root iframe {
        display: block;
        width: 100%;
        overflow: hidden;
        border: 0;
    }

    @media (max-width: 767px) {
        .root h2 {
            font-size: 2.4rem;
        }

        .root h3 {
            font-size: 2.1rem;
        }
    }

    .root > * + * {
        margin-top: 2.8rem;
        margin-bottom: 0;
    }

    .root > hr,
    .root > blockquote {
        position: relative;
        margin-top: 4rem;
    }

    .root > hr + *,
    .root > blockquote + * {
        margin-top: 4rem;
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
        font-size: var(--content-font-size, 1.9rem);
        letter-spacing: var(--content-letter-spacing, 0);
    }

    .root ul,
    .root ol,
    .root dl {
        padding-left: 2.8rem;
    }

    .root li + li {
        margin-top: 0.8rem;
    }

    @media (max-width: 767px) {
        .root {
            margin-top: 3.2rem;
        }

        .root > * + * {
            margin-top: 2rem;
        }

        .root > [id]:not(:first-child) {
            margin-top: 3.2rem;
        }

        .root > blockquote:not([class]),
        .root > ol,
        .root > ul,
        .root > dl,
        .root > p {
            font-size: 1.7rem;
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
