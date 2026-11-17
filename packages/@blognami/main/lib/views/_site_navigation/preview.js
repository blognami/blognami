const SIMPLE_EXAMPLE = '- [Home](/)\n- [About](/about)\n- [Contact](/contact)';

const GROUPED_EXAMPLE = '- [Home](/)\n- [About](/about)\n\n## Writing\n- [Latest posts](/)\n- [Tags](/tags)\n\n## Projects\n- [Side projects](/projects)\n- [Uses](/uses)';

// Loads inside the markdown editor's `_blognami/_content` wrapper, whose
// `.root a`, `.root h2`, `.root p`, `.root ul` and `.root li + li` rules
// (0,1,1) restyle the sidebar markup. The rules below restate the live
// sidebar's values at 0,1,2, below its hover and active states (0,2,0).
// The empty state restates the default preview's muted values, each rule led
// by `div.emptyState` to beat the wrapper's rules, `.root li + li` included.
export const styles = ({ colors, remify }) => `
    .root {
        display: flex;
        flex-direction: column;
        gap: ${remify(4)};
        width: ${remify(256)};
    }

    .root li a {
        color: ${colors.gray[700]};
        text-decoration: none;
        word-break: normal;
    }

    .root div h2 {
        margin: 0;
        font-size: inherit;
        line-height: inherit;
        letter-spacing: normal;
    }

    .root div > p {
        margin: ${remify(2)} 0 ${remify(6)};
        font-size: ${remify(14)};
        line-height: 1.55;
        color: ${colors.gray[700]};
    }

    .root div ul {
        padding-left: 0;
    }

    .root ul li + li {
        margin-top: 0;
    }

    div.emptyState {
        color: ${colors.gray[500]};
        font-size: 0.9em;
    }

    div.emptyState p {
        margin: 0 0 ${remify(8)};
        color: inherit;
        line-height: inherit;
    }

    div.emptyState ul {
        margin: 0 0 ${remify(16)};
        padding-left: ${remify(20)};
    }

    div.emptyState ul li {
        margin: 0 0 ${remify(4)};
    }

    div.emptyState code {
        background: ${colors.gray[100]};
        color: inherit;
        padding: ${remify(1)} ${remify(5)};
        border-radius: ${remify(4)};
    }

    div.emptyState div.examples {
        display: flex;
        gap: ${remify(12)};
    }

    div.emptyState div.examples > div {
        flex: 1 1 0;
    }

    div.emptyState div.examples button {
        display: inline-block;
        padding: ${remify(4)} ${remify(10)};
        border: ${remify(1)} solid ${colors.gray[300]};
        border-radius: ${remify(6)};
        background: ${colors.white};
        color: ${colors.gray[700]};
        font-size: 0.85em;
        cursor: pointer;
    }

    div.emptyState div.examples button:hover {
        background: ${colors.gray[100]};
    }

    div.emptyState div.examples p {
        margin: ${remify(6)} 0 0;
        font-size: 0.85em;
    }
`;

export default {
    render(){
        const value = this.params.value ?? '';

        if(value.trim() === ''){
            return this.renderHtml`
                <div class="${this.cssClasses.emptyState}" data-test-id="site-navigation-preview-empty-state">
                    <p>This is your sidebar navigation, written in markdown.</p>
                    <ul>
                        <li>Links before the first <code>## Heading</code> show at the top, ungrouped.</li>
                        <li>Each <code>## Heading</code> starts a collapsible sidebar group.</li>
                        <li>List links <code>- [Label](/url)</code> become that group's links.</li>
                    </ul>
                    <div class="${this.cssClasses.examples}">
                        <div>
                            <button type="button" class="${this.cssClassesFor('_markdown_editor/modal').valueInserter}" data-value="${SIMPLE_EXAMPLE}" data-test-id="use-example-simple">Use this example: Simple</button>
                            <p>A few links</p>
                        </div>
                        <div>
                            <button type="button" class="${this.cssClassesFor('_markdown_editor/modal').valueInserter}" data-value="${GROUPED_EXAMPLE}" data-test-id="use-example-grouped">Use this example: Grouped</button>
                            <p>Links under headings</p>
                        </div>
                    </div>
                </div>
            `;
        }

        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                ${this.renderView('_sidebar/_top_section', { navigation: value })}
            </div>
        `;
    }
};
