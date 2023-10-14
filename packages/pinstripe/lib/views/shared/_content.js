
export const styles = `        
    .root {
        margin-top: 4rem;
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
