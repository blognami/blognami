
export const styles = ({ colors, shadow, remify }) => `
    .root {
        display: inline-block;
        max-width: 100%;
        background: ${colors.white};
        border: ${remify(1)} solid ${colors.gray[200]};
        border-radius: ${remify(10)};
        box-shadow: ${shadow.lg};
        padding: ${remify(8)} ${remify(10)} ${remify(10)};
        font-family: system-ui, -apple-system, sans-serif;
    }
    .root h2 {
        margin: 0;
        padding: ${remify(6)} ${remify(6)} ${remify(10)};
        font-size: ${remify(11)};
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: ${colors.gray[500]};
    }
    .root table {
        border-collapse: collapse;
        width: 100%;
    }
    .root th {
        text-align: left;
        padding: ${remify(4)} ${remify(10)};
        font-size: ${remify(11)};
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: ${colors.gray[400]};
        border-bottom: ${remify(1)} solid ${colors.gray[200]};
    }
    .root td {
        padding: ${remify(6)} ${remify(10)};
        font-size: ${remify(14)};
        color: ${colors.gray[800]};
        vertical-align: middle;
        border-bottom: ${remify(1)} solid ${colors.gray[100]};
    }
    .root tbody tr:last-child td {
        border-bottom: none;
    }
    .root tbody tr:hover td {
        background: ${colors.gray[50]};
    }
    .root td:first-child {
        font-family: monospace;
        font-size: ${remify(13)};
        color: ${colors.gray[600]};
        white-space: nowrap;
    }
    .root td code {
        font-family: monospace;
    }
    .root td a {
        color: inherit;
        text-decoration: underline;
    }
    .root td:last-child {
        text-align: right;
        white-space: nowrap;
    }
    .root button {
        border: ${remify(1)} solid ${colors.gray[300]};
        border-radius: ${remify(6)};
        background: ${colors.white};
        padding: ${remify(4)} ${remify(10)};
        font-size: ${remify(12)};
        color: ${colors.gray[700]};
        cursor: pointer;
        white-space: nowrap;
        transition: background 0.12s ease, border-color 0.12s ease;
    }
    .root button:hover {
        background: ${colors.gray[100]};
        border-color: ${colors.gray[400]};
    }
    .root button:active {
        transform: translateY(${remify(1)});
    }
`;

export default {
    render(){
        return this.renderHtml`
            <div class="${this.cssClasses.root}">
                <h2>Markdown help</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Markdown</th>
                            <th>Result</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>**text**</td>
                            <td><strong>Bold</strong></td>
                            <td>
                                <button
                                    class="${this.cssClassesFor('_markdown_editor/modal').lineInserter}"  
                                    data-line-content="This **here** is an example of some bold text."
                                >Insert Example</button>
                            </td>
                        </tr>
                        <tr>
                            <td>*text*</td>
                            <td><em>Emphasize</em></td>
                            <td>
                                <button 
                                    class="${this.cssClassesFor('_markdown_editor/modal').lineInserter}" 
                                    data-line-content="This *here* is an example of some emphasized text."
                                >Insert Example</button>
                            </td>
                        </tr>
                        <tr>
                            <td>~~text~~</td>
                            <td><del>Strike-through</del></td>
                            <td>
                                <button
                                    class="${this.cssClassesFor('_markdown_editor/modal').lineInserter}"
                                    data-line-content="This ~~here~~ is an example of some strike-through text."
                                >Insert Example</button>
                            </td>
                        </tr>
                        <tr>
                            <td>[title](http://)</td>
                            <td><a href="#">Link</a></td>
                            <td>
                                <button
                                    class="${this.cssClassesFor('_markdown_editor/modal').lineInserter}" 
                                    data-line-content="This [here](https://example.com) is an example of a link."
                                >Insert Example</button>
                            </td>
                        </tr>
                        <tr>
                            <td>\`code\`</td>
                            <td><code>Inline Code</code></td>
                            <td>
                                <button
                                    class="${this.cssClassesFor('_markdown_editor/modal').lineInserter}" 
                                    data-line-content="This \`here\` is an example of some inline code."
                                >Insert Example</button>
                            </td>
                        </tr>
                        <tr>
                            <td>![alt](http://)</td>
                            <td>Image</td>
                            <td>
                                <button
                                    class="${this.cssClassesFor('_markdown_editor/modal').lineInserter}" 
                                    data-line-content="This is an example of an image:\n\n![Example alt text](https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Markdown-mark.svg/1920px-Markdown-mark.svg.png)."
                                >Insert Example</button>
                            </td>
                        </tr>
                        <tr>
                            <td>* item</td>
                            <td>List</td>
                            <td>
                                <button
                                    class="${this.cssClassesFor('_markdown_editor/modal').lineInserter}" 
                                    data-line-content="* This is an example of a list item."
                                >Insert Example</button>
                            </td>
                        </tr>
                        <tr>
                            <td>1. item</td>
                            <td>Ordered List</td>
                            <td>
                                <button
                                    class="${this.cssClassesFor('_markdown_editor/modal').lineInserter}" 
                                    data-line-content="1. This is an example of an ordered list item."
                                >Insert Example</button>
                            </td>
                        </tr>
                        <tr>
                            <td>> quote</td>
                            <td>Blockquote</td>
                            <td>
                                <button
                                    class="${this.cssClassesFor('_markdown_editor/modal').lineInserter}" 
                                    data-line-content="&gt; This is an example of a quote."
                                >Insert Example</button>
                            </td>
                        </tr>
                        <tr>
                            <td># Heading</td>
                            <td>H1</td>
                            <td>
                                <button
                                    class="${this.cssClassesFor('_markdown_editor/modal').lineInserter}" 
                                    data-line-content="# This is an example of a level 1 heading"
                                >Insert Example</button>
                            </td>
                        </tr>
                        <tr>
                            <td>## Heading</td>
                            <td>H2</td>
                            <td>
                                <button
                                    class="${this.cssClassesFor('_markdown_editor/modal').lineInserter}" 
                                    data-line-content="## This is an example of a level 2 heading"
                                >Insert Example</button>
                            </td>
                        </tr>
                        <tr>
                            <td>### Heading</td>
                            <td>H3</td>
                            <td>
                                <button
                                    class="${this.cssClassesFor('_markdown_editor/modal').lineInserter}" 
                                    data-line-content="## This is an example of a level 3 heading"
                                >Insert Example</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }
}
