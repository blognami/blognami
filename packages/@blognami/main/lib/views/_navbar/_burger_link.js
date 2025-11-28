export const styles = ({ colors, breakpointFor, remify }) => `
    .root {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 2em;
        height: 2em;
        cursor: pointer;
        gap: 0.3em;
        background: none;
        border: none;
        padding: 0;
        text-decoration: none;
    }

    .root > span {
        display: block;
        width: 1.5em;
        height: 0.2em;
        background: ${colors.gray[700]};
        border-radius: ${remify(2)};
        transition: all 0.3s;
    }

    ${breakpointFor('md')} {
        .root {
            display: none;
        }
    }
`;

export default {
    render(){
        return this.renderHtml`
            <a class="${this.cssClasses.root}" href="/_navbar/burger_menu" target="_overlay" data-test-id="navbar-burger">
                <span></span>
                <span></span>
                <span></span>
            </a>
        `;
    }
};