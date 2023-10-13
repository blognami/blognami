
export default {
    render(){
        return this.renderHtml`
            <div>
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
                                    class="${this.cssClassesFor('main/markdown/editor').lineInserter}"  
                                    data-line-content="This **here** is an example of some bold text."
                                >Insert Example</button>
                            </td>
                        </tr>
                        <tr>
                            <td>*text*</td>
                            <td><em>Emphasize</em></td>
                            <td>
                                <button 
                                    class="${this.cssClassesFor('main/markdown/editor').lineInserter}" 
                                    data-line-content="This *here* is an example of some emphasized text."
                                >Insert Example</button>
                            </td>
                        </tr>
                        <tr>
                            <td>~~text~~</td>
                            <td><del>Strike-through</del></td>
                            <td>
                                <button
                                    class="${this.cssClassesFor('main/markdown/editor').lineInserter}"
                                    data-line-content="This ~~here~~ is an example of some strike-through text."
                                >Insert Example</button>
                            </td>
                        </tr>
                        <tr>
                            <td>[title](http://)</td>
                            <td><a href="#">Link</a></td>
                            <td>
                                <button
                                    class="${this.cssClassesFor('main/markdown/editor').lineInserter}" 
                                    data-line-content="This [here](https://example.com) is an example of a link."
                                >Insert Example</button>
                            </td>
                        </tr>
                        <tr>
                            <td>\`code\`</td>
                            <td><code>Inline Code</code></td>
                            <td>
                                <button
                                    class="${this.cssClassesFor('main/markdown/editor').lineInserter}" 
                                    data-line-content="This \`here\` is an example of some inline code."
                                >Insert Example</button>
                            </td>
                        </tr>
                        <tr>
                            <td>![alt](http://)</td>
                            <td>Image</td>
                            <td>
                                <button
                                    class="${this.cssClassesFor('main/markdown/editor').lineInserter}" 
                                    data-line-content="This is an example of an image:\n\n![Example alt text](https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Markdown-mark.svg/1920px-Markdown-mark.svg.png)."
                                >Insert Example</button>
                            </td>
                        </tr>
                        <tr>
                            <td>* item</td>
                            <td>List</td>
                            <td>
                                <button
                                    class="${this.cssClassesFor('main/markdown/editor').lineInserter}" 
                                    data-line-content="* This is an example of a list item."
                                >Insert Example</button>
                            </td>
                        </tr>
                        <tr>
                            <td>1. item</td>
                            <td>Ordered List</td>
                            <td>
                                <button
                                    class="${this.cssClassesFor('main/markdown/editor').lineInserter}" 
                                    data-line-content="1. This is an example of an ordered list item."
                                >Insert Example</button>
                            </td>
                        </tr>
                        <tr>
                            <td>> quote</td>
                            <td>Blockquote</td>
                            <td>
                                <button
                                    class="${this.cssClassesFor('main/markdown/editor').lineInserter}" 
                                    data-line-content="&gt; This is an example of a quote."
                                >Insert Example</button>
                            </td>
                        </tr>
                        <tr>
                            <td># Heading</td>
                            <td>H1</td>
                            <td>
                                <button
                                    class="${this.cssClassesFor('main/markdown/editor').lineInserter}" 
                                    data-line-content="# This is an example of a level 1 heading"
                                >Insert Example</button>
                            </td>
                        </tr>
                        <tr>
                            <td>## Heading</td>
                            <td>H2</td>
                            <td>
                                <button
                                    class="${this.cssClassesFor('main/markdown/editor').lineInserter}" 
                                    data-line-content="## This is an example of a level 2 heading"
                                >Insert Example</button>
                            </td>
                        </tr>
                        <tr>
                            <td>### Heading</td>
                            <td>H3</td>
                            <td>
                                <button
                                    class="${this.cssClassesFor('main/markdown/editor').lineInserter}" 
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
