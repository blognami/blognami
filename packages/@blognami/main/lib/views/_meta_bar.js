
export const styles = ({ colors, remify }) => `
    .root {
        display: block;
        margin-bottom: ${remify(20)};
        font-size: ${remify(12)};
        font-weight: 500;
        line-height: 1;
        color: ${colors.semantic.secondaryText};
        text-transform: uppercase;
    }

    .root a {
        font-weight: 600;
    }

    .root em {
        color: ${colors.semantic.accent};
        font-style: normal;
    }
`;

export default {
    render(){
        const { body } = this.params;

        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                ${body}
            </div>
        `;
    }
}
