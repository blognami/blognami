
export const styles = ({ colors, remify }) =>`
    .root:not(:first-child){
        margin-top: 2em;
    }

    .title {
        display: flex;
        align-items: center;
        margin-bottom: ${remify(24)};
        font-size: ${remify(12)};
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.01em;
    }

    .title::after {
        flex-grow: 1;
        height: 1px;
        margin-left: ${remify(16)};
        content: "";
        background-color: ${colors.gray[200]};
    }

    .root > * + * {
        margin-top: ${remify(20)};
    }
`;

export default {
    render(){
        const { title, testId, level = 2, body} = this.params;
        
        return this.renderHtml`
            <section class="${this.cssClasses.root}" ${testId ? this.renderHtml`data-test-id="${testId}"` : ''}>
                <h${level} class="${this.cssClasses.title}">${title}</h${level}>
                ${body}
            </section>
        `;
    }
};
