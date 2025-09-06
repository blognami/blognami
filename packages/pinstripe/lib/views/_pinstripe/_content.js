
export const styles = ({ colors, packages, fonts }) =>`
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
        font-size: 4.6rem;
    }
    
    @media (max-width: 767px) {
        .root h1 {
            font-size: 3.2rem;
        }
    }

    .root h2 {
        font-size: 2.8rem;
    }

    .root h3 {
        font-size: 2.4rem;
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

    .root blockquote:not([class]) {
        padding-left: 2rem;
        border-left: 4px solid ${packages.pinstripe.colors.accent};
    }

    .root figcaption {
        margin-top: 1.6rem;
        font-size: 1.4rem;
        line-height: 1.4;
        color: ${packages.pinstripe.colors.secondaryText};
        text-align: center;
    }

    .root pre {
        padding: 1.6rem 2.4rem;
        overflow-x: scroll;
        hyphens: none;
        line-height: 1.5;
        white-space: pre;
        background-color: ${colors.gray[50]};
        -webkit-overflow-scrolling: touch;
    }

    .root code {
        font-family: ${fonts.mono};
        font-size: 15px;
    }

    .root pre > code {
        max-width: 600px;
        display: block;
        overflow: auto;
    }

    .root :not(pre) > code {
        padding: 0.4rem;
        color: ${packages.pinstripe.colors.accent};
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
